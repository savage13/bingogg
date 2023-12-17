'use client';
import { useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Board from '@/components/board/Board';
import RoomLogin from '@/components/room/RoomLogin';
import { ConnectionStatus, RoomContext } from '@/context/RoomContext';

const board = [
    [
        'Collect 5 things',
        'Talk to 10 people',
        'A pointy device',
        'Obtain a hammer',
        'YELL',
    ],
    ['10 Wells', '15 flames', 'Beat the game', 'Die 10 times', 'Beat 5-2'],
    [
        'Beat 3-5',
        'Discover Persia',
        'Invent Religion',
        'C O N Q U E S T',
        'this is a really long goal name because sometimes these will exist and it needs to be tested against',
    ],
    [
        'Return to Madagascar',
        'Morph Ball',
        '500 HP',
        '50 coins',
        'Have a civil war',
    ],
    ['Game over', 'Kill 300 enemies', 'Explosives', 'Compass', 'Roads'],
];

export default function Room({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const { connectionStatus } = useContext(RoomContext);
    const [boardState, setBoardState] = useState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ]);
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState('');

    const { sendMessage, readyState, lastMessage, getWebSocket } = useWebSocket(
        `ws://localhost:8000/rooms/${slug}`,
    );

    useEffect(() => {
        if (lastMessage !== null) {
            setMessages((prev) => [...prev, lastMessage.data]);
        }
    }, [lastMessage, setMessages]);

    if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
        return <RoomLogin />;
    }

    const colors = [
        'indigo',
        'darkorange',
        'maroon',
        // 'purple',
        // 'forestgreen',
        // 'aqua',
        // 'violet',
        // 'red',
        // 'white',
        // 'lime',
        // 'gray',
        // 'yellow',
        // '#2d587e',
        // '#54f7e5',
        // '#548715',
        // '#58fe87',
        // '#5e8a78',
        // '#54a841',
        // '#a7e452',
        // '#157854',
    ];
    const colorPortion = 360 / colors.length;

    return (
        <div className="flex gap-x-8">
            <div className="block w-1/2">
                <Board />
            </div>
            <div className="grow" />
            <div className="flex flex-col border px-2 py-2">
                <div>Socket Status: {connectionStatus}</div>
                <div className="h-96 overflow-y-scroll">
                    {messages.map((message, index) => (
                        <div key={`${message}-${index}`}>{message}</div>
                    ))}
                </div>
                <div className="flex gap-x-2 text-black">
                    <input
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage(message);
                                setMessage('');
                            }
                        }}
                        className="grow"
                    />
                    <button
                        className="bg-gray-200 px-2 py-2"
                        onClick={() => {
                            sendMessage(message);
                            setMessage('');
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
