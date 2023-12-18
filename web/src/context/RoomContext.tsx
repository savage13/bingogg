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
    UNAUTHORIZED, // the current authentication has been invalidated by the server
    CLOSING, // the connection is in the process of closing
    CLOSED, // connection was manually closed, and the user is completely disconnected
}

interface RoomContext {
    connectionStatus: ConnectionStatus;
    board: Board;
    messages: string[];
    connect: (nickname: string, password: string) => void;
    sendChatMessage: (message: string) => void;
    markGoal: (row: number, col: number) => void;
    unmarkGoal: (row: number, col: number) => void;
}

export const RoomContext = createContext<RoomContext>({
    connectionStatus: ConnectionStatus.UNINITIALIZED,
    board: { board: [] },
    messages: [],
    connect() {},
    sendChatMessage(message) {},
    markGoal(row, col) {},
    unmarkGoal(row, col) {},
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
    // actions
    const join = useCallback(() => {
        if (websocket) {
            websocket.send(
                JSON.stringify({
                    action: 'join',
                    authToken: authToken,
                }),
            );
        }
    }, [websocket, authToken]);
    const connect = useCallback(
        async (nickname: string, password: string) => {
            const newSocket = new WebSocket(
                `ws://localhost:8000/rooms/${slug}`,
            );
            const res = await fetch(
                `http://localhost:8000/api/rooms/${slug}/authorize`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nickname, password }),
                },
            );
            const token = await res.json();
            setAuthToken(token.authToken);
            localStorage.setItem(`authToken-${slug}`, token.authToken);
            setWebsocket(newSocket);
            setConnectionStatus(ConnectionStatus.CONNECTING);
        },
        [slug],
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

    // effects
    // slug changed, try to establish initial connection from storage
    useEffect(() => {
        if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
            // load a cached token and use it if present
            const storedToken = localStorage.getItem(`authToken-${slug}`);
            if (storedToken) {
                setAuthToken(storedToken);
                console.log('websocket created from localstorage');
                setWebsocket(
                    new WebSocket(`ws://localhost:8000/rooms/${slug}`),
                );
                setConnectionStatus(ConnectionStatus.CONNECTING);
            }
        }
    }, [slug, connectionStatus]);

    // websocket changed, attach listeners and prepare cleanup
    useEffect(() => {
        console.log('websocket changed');
        if (websocket) {
            websocket.addEventListener('open', () => {
                console.log('websocket on')
                join();
            });
            websocket.addEventListener('close', () => {
                console.log('websocket closed');
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
                }
            });
        }
        // cleanup the connection
        return () => {
            if (websocket) {
                console.log('closing websocket');
                setConnectionStatus(ConnectionStatus.CLOSING);
                websocket.close();
            }
        };
    }, [websocket, onChatMessage, onCellUpdate, onSyncBoard, join]);

    return (
        <RoomContext.Provider
            value={{
                connectionStatus,
                board,
                messages,
                connect,
                sendChatMessage,
                markGoal,
                unmarkGoal,
            }}
        >
            {children}
        </RoomContext.Provider>
    );
}
