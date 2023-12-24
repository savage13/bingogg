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

export enum ConnectionStatus {
    UNINITIALIZED, // the room connection is uninitialized and there is no authentication data present
    CONNECTING, // the server has confirmed the password, but has not yet confirmed the room connection
    CONNECTED, // actively connected to the server with valid authentication
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
    // const [board, setBoard] = useState<Board>({ board: [] });
    const [messages, setMessages] = useState<string[]>([]);
    const [websocket, setWebsocket] = useState<WebSocket>();
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

    // callbacks
    //misc callbacks
    const updateWebsocket = useCallback(
        (newSocket: WebSocket) => {
            if (websocket) {
                websocket.close();
            }
            setWebsocket(newSocket);
        },
        [websocket],
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
        if (websocket) {
            websocket.close();
        }
        setWebsocket(undefined);
    }, [websocket]);
    // actions
    const join = useCallback(() => {
        if (websocket) {
            websocket.send(
                JSON.stringify({
                    action: 'join',
                    authToken: authToken,
                    payload: nickname ? { nickname } : undefined,
                }),
            );
        }
    }, [websocket, authToken, nickname]);
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
            updateWebsocket(new WebSocket(`ws://localhost:8000/rooms/${slug}`));
            setConnectionStatus(ConnectionStatus.CONNECTING);
            setNickname(nickname);
        },
        [slug, updateWebsocket],
    );
    const sendChatMessage = useCallback(
        (message: string) => {
            if (websocket) {
                websocket.send(
                    JSON.stringify({
                        action: 'chat',
                        authToken,
                        payload: {
                            message,
                        },
                    }),
                );
            }
        },
        [websocket, authToken],
    );
    const markGoal = useCallback(
        (row: number, col: number) => {
            if (websocket) {
                websocket.send(
                    JSON.stringify({
                        action: 'mark',
                        authToken,
                        payload: {
                            row,
                            col,
                        },
                    }),
                );
            }
        },
        [websocket, authToken],
    );
    const unmarkGoal = useCallback(
        (row: number, col: number) => {
            if (websocket) {
                websocket.send(
                    JSON.stringify({
                        action: 'unmark',
                        authToken,
                        payload: {
                            row,
                            col,
                        },
                    }),
                );
            }
        },
        [websocket, authToken],
    );
    const changeColor = useCallback(
        (color: string) => {
            setColor(color);
            if (websocket) {
                websocket.send(
                    JSON.stringify({
                        action: 'changeColor',
                        authToken,
                        payload: { color },
                    }),
                );
            }
        },
        [websocket, authToken],
    );

    // effects
    // slug changed, try to establish initial connection from storage
    useEffect(() => {
        if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
            // load a cached token and use it if present
            const storedToken = localStorage.getItem(`authToken-${slug}`);
            if (storedToken) {
                setAuthToken(storedToken);
                updateWebsocket(
                    new WebSocket(`ws://localhost:8000/rooms/${slug}`),
                );
                setConnectionStatus(ConnectionStatus.CONNECTING);
            }
        }
    }, [slug, connectionStatus, updateWebsocket]);

    // websocket changed, attach listeners and prepare cleanup
    useEffect(() => {
        if (websocket) {
            websocket.addEventListener('open', () => {
                join();
            });
            websocket.addEventListener('close', () => {
                setAuthToken('');
                setConnectionStatus(ConnectionStatus.CLOSED);
            });
            websocket.addEventListener('message', (message) => {
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
            });
        }
    }, [
        websocket,
        onChatMessage,
        onCellUpdate,
        onSyncBoard,
        join,
        onConnected,
        onUnauthorized,
    ]);
    // cleanup
    useEffect(() => {
        // cleanup the connection
        return () => {
            if (websocket) {
                setConnectionStatus(ConnectionStatus.CLOSING);
                websocket.close();
            }
        };
    }, [websocket]);

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
