'use client';
import { useContext, useState } from 'react';
import Board from '@/components/board/Board';
import RoomLogin from '@/components/room/RoomLogin';
import { ConnectionStatus, RoomContext } from '@/context/RoomContext';
import ColorSelect from '@/components/room/ColorSelect';

export default function Room() {
    const { connectionStatus, sendChatMessage, messages } =
        useContext(RoomContext);
    const [message, setMessage] = useState('');

    if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
        return <RoomLogin />;
    }

    if (connectionStatus === ConnectionStatus.CLOSED) {
        return (
            <>
                The connection has been closed. Try logging in again.
                <RoomLogin />
            </>
        );
    }

    return (
        <div className="flex gap-x-8">
            <div className="block w-1/2">
                <div className="pb-4">
                    <ColorSelect />
                </div>
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
                                sendChatMessage(message);
                                setMessage('');
                            }
                        }}
                        className="grow"
                    />
                    <button
                        className="bg-gray-200 px-2 py-2"
                        onClick={() => {
                            sendChatMessage(message);
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
