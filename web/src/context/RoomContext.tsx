'use client';
import {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { Board, Cell } from '../types/Board';
import { ServerMessage } from '../types/ServerMessage';
import useWebSocket from 'react-use-websocket';

export enum ConnectionStatus {
    UNINITIALIZED, // the room connection is uninitialized and there is no authentication data present
    CONNECTING, // the server has confirmed the password, but has not yet confirmed the room connection
    CONNECTED, // actively connected to the server with valid authentication
    UNAUTHORIZED, // received an unauthorized message from the server
    CLOSING, // the connection is in the process of closing
    CLOSED, // connection was manually closed, and the user is completely disconnected
}

interface RoomContext {
    connectionStatus: ConnectionStatus;
    board: Board;
    messages: string[];
    color: string;
    connect: (nickname: string, password: string) => void;
    sendChatMessage: (message: string) => void;
    markGoal: (row: number, col: number) => void;
    unmarkGoal: (row: number, col: number) => void;
    changeColor: (color: string) => void;
}

export const RoomContext = createContext<RoomContext>({
    connectionStatus: ConnectionStatus.UNINITIALIZED,
    board: { board: [] },
    messages: [],
    color: 'blue',
    connect() {},
    sendChatMessage(message) {},
    markGoal(row, col) {},
    unmarkGoal(row, col) {},
    changeColor() {},
});

interface RoomContextProps {
    slug: string;
    children: ReactNode;
}

type BoardEvent =
    | {
          action: 'cell';
          row: number;
          col: number;
          cell: Cell;
      }
    | {
          action: 'board';
          board: Board;
      };

export function RoomContextProvider({ slug, children }: RoomContextProps) {
    // state
    const [messages, setMessages] = useState<string[]>([]);
    const [connectionStatus, setConnectionStatus] = useState(
        ConnectionStatus.UNINITIALIZED,
    );
    const [authToken, setAuthToken] = useState<string>();
    const [nickname, setNickname] = useState('');
    const [color, setColor] = useState('blue');

    const [board, dispatchBoard] = useReducer(
        (currBoard: Board, event: BoardEvent) => {
            switch (event.action) {
                case 'board':
                    return event.board;
                case 'cell':
                    currBoard.board[event.row][event.col] = event.cell;
                    return currBoard;
            }
            return currBoard;
        },
        { board: [] },
    );

    // incoming messages
    const onChatMessage = useCallback((message: string) => {
        setMessages((curr) => [...curr, message]);
    }, []);
    const onCellUpdate = useCallback(
        (row: number, col: number, cellData: Cell) => {
            dispatchBoard({ action: 'cell', row, col, cell: cellData });
        },
        [],
    );
    const onSyncBoard = useCallback((board: Board) => {
        dispatchBoard({ action: 'board', board });
    }, []);
    const onConnected = useCallback(
        (board: Board, chatHistory: string[], nickname?: string) => {
            if (nickname) {
                setNickname(nickname);
            }
            dispatchBoard({ action: 'board', board });
            setMessages(chatHistory);
            setConnectionStatus(ConnectionStatus.CONNECTED);
        },
        [],
    );
    const onUnauthorized = useCallback(() => {
        setAuthToken('');
        setConnectionStatus(ConnectionStatus.UNAUTHORIZED);
        localStorage.removeItem(`authToken-${slug}`);
    }, [slug]);

    // websocket
    const { sendJsonMessage } = useWebSocket(
        `ws://localhost:8000/rooms/${slug}`,
        {
            share: true,
            onOpen() {},
            onMessage(message) {
                const payload = JSON.parse(message.data) as ServerMessage;
                if (!payload.action) {
                    return;
                }
                switch (payload.action) {
                    case 'chat':
                        if (!payload.message) return;
                        onChatMessage(payload.message);
                        break;
                    case 'cellUpdate':
                        if (
                            payload.row === undefined ||
                            payload.col === undefined ||
                            !payload.cell
                        )
                            return;
                        onCellUpdate(payload.row, payload.col, payload.cell);
                        break;
                    case 'syncBoard':
                        if (!payload.board) return;
                        onSyncBoard(payload.board);
                        break;
                    case 'connected':
                        if (!payload.board || !payload.chatHistory) return;
                        onConnected(
                            payload.board,
                            payload.chatHistory,
                            payload.nickname,
                        );
                        break;
                    case 'unauthorized':
                        onUnauthorized();
                        break;
                }
            },
            onClose() {
                setAuthToken('');
                setConnectionStatus(ConnectionStatus.CLOSED);
            },
        },
        connectionStatus === ConnectionStatus.CONNECTING ||
            connectionStatus === ConnectionStatus.CONNECTED,
    );

    // actions
    const join = useCallback(
        (token: string, nickname?: string) => {
            sendJsonMessage({
                action: 'join',
                authToken: token,
                payload: nickname ? { nickname } : undefined,
            });
        },
        [sendJsonMessage],
    );
    const connect = useCallback(
        async (nickname: string, password: string) => {
            const res = await fetch(
                `http://localhost:8000/api/rooms/${slug}/authorize`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                },
            );
            const token = await res.json();
            setAuthToken(token.authToken);
            localStorage.setItem(`authToken-${slug}`, token.authToken);
            setConnectionStatus(ConnectionStatus.CONNECTING);
            setNickname(nickname);
            join(token.authToken, nickname);
        },
        [slug, join],
    );
    const sendChatMessage = useCallback(
        (message: string) => {
            sendJsonMessage({
                action: 'chat',
                authToken,
                payload: {
                    message,
                },
            });
        },
        [authToken, sendJsonMessage],
    );
    const markGoal = useCallback(
        (row: number, col: number) => {
            sendJsonMessage({
                action: 'mark',
                authToken,
                payload: {
                    row,
                    col,
                },
            });
        },
        [authToken, sendJsonMessage],
    );
    const unmarkGoal = useCallback(
        (row: number, col: number) => {
            sendJsonMessage({
                action: 'unmark',
                authToken,
                payload: {
                    row,
                    col,
                },
            });
        },
        [authToken, sendJsonMessage],
    );
    const changeColor = useCallback(
        (color: string) => {
            setColor(color);
            sendJsonMessage({
                action: 'changeColor',
                authToken,
                payload: { color },
            });
        },
        [authToken, sendJsonMessage],
    );

    // effects
    // slug changed, try to establish initial connection from storage
    useEffect(() => {
        if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
            // load a cached token and use it if present
            const storedToken = localStorage.getItem(`authToken-${slug}`);
            if (storedToken) {
                setAuthToken(storedToken);
                setConnectionStatus(ConnectionStatus.CONNECTING);
                join(storedToken);
            }
        }
    }, [slug, connectionStatus, join]);

    return (
        <RoomContext.Provider
            value={{
                connectionStatus,
                board,
                messages,
                color,
                connect,
                sendChatMessage,
                markGoal,
                unmarkGoal,
                changeColor,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}
