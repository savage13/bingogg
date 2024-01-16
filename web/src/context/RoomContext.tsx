'use client';
import {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useState,
    useSyncExternalStore,
} from 'react';
import useWebSocket from 'react-use-websocket';
import {
    emitBoardUpdate,
    getBoardSnapshot,
    subscribeToBoardUpdates,
} from '../lib/BoardStore';
import { Board, Cell } from '../types/Board';
import { RoomData } from '../types/RoomData';
import { ChatMessage, ServerMessage } from '../types/ServerMessage';

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
    messages: ChatMessage[];
    color: string;
    roomData?: RoomData;
    connect: (
        nickname: string,
        password: string,
    ) => Promise<{ success: boolean; message?: string }>;
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
    async connect() {
        return { success: false };
    },
    sendChatMessage(message) {},
    markGoal(row, col) {},
    unmarkGoal(row, col) {},
    changeColor() {},
});

interface RoomContextProps {
    slug: string;
    children: ReactNode;
}

export function RoomContextProvider({ slug, children }: RoomContextProps) {
    // state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState(
        ConnectionStatus.UNINITIALIZED,
    );
    const [authToken, setAuthToken] = useState<string>();
    const [nickname, setNickname] = useState('');
    const [color, setColor] = useState('blue');
    const [roomData, setRoomData] = useState<RoomData>();
    const [loading, setLoading] = useState(true);

    // const [board, dispatchBoard] = useReducer(boardReducer, { board: [] });
    const board = useSyncExternalStore(
        subscribeToBoardUpdates,
        getBoardSnapshot,
        () => ({ board: [] }),
    );

    // incoming messages
    const onChatMessage = useCallback((message: ChatMessage) => {
        setMessages((curr) => [...curr, message]);
    }, []);
    const onCellUpdate = useCallback(
        (row: number, col: number, cellData: Cell) => {
            emitBoardUpdate({ action: 'cell', row, col, cell: cellData });
        },
        [],
    );
    const onSyncBoard = useCallback((board: Board) => {
        emitBoardUpdate({ action: 'board', board });
    }, []);
    const onConnected = useCallback(
        (
            board: Board,
            chatHistory: ChatMessage[],
            roomData: RoomData,
            nickname?: string,
            color?: string,
        ) => {
            if (nickname) {
                setNickname(nickname);
            }
            if (color) {
                setColor(color);
            }
            emitBoardUpdate({ action: 'board', board });
            setMessages(chatHistory);
            setConnectionStatus(ConnectionStatus.CONNECTED);
            setRoomData(roomData);
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
                        if (
                            !payload.board ||
                            !payload.chatHistory ||
                            !payload.roomData
                        )
                            return;
                        onConnected(
                            payload.board,
                            payload.chatHistory,
                            payload.roomData,
                            payload.nickname,
                            payload.color,
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
                console.log('closing ws connection');
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
            const res = await fetch(`/api/rooms/${slug}/authorize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                if (res.status === 403) {
                    return { success: false, message: 'Incorrect password' };
                }
                return {
                    success: false,
                    message: 'An error occurred while processing your request.',
                };
            }
            const token = await res.json();
            setAuthToken(token.authToken);
            localStorage.setItem(`authToken-${slug}`, token.authToken);
            setConnectionStatus(ConnectionStatus.CONNECTING);
            setNickname(nickname);
            join(token.authToken, nickname);
            return { success: true };
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
            const tempNickname = localStorage.getItem('bingogg.temp.nickname');
            localStorage.removeItem('bingogg.temp.nickname');
            if (storedToken) {
                setAuthToken(storedToken);
                if (tempNickname) {
                    setNickname(tempNickname);
                }
                setConnectionStatus(ConnectionStatus.CONNECTING);
                join(storedToken, tempNickname ?? undefined);
            }
        }
        setLoading(false);
    }, [slug, connectionStatus, join]);

    // prevent UI flash when restoring from local storage due to SSR, reducing
    // the number of re-renders for the room page since all the state changes
    // after connection will usually be batched
    if (loading) {
        return 'loading...';
    }

    return (
        <RoomContext.Provider
            value={{
                connectionStatus,
                board,
                messages,
                color,
                roomData,
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
