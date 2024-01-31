'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { RoomContext } from '@/context/RoomContext';

export default function RoomChat() {
    const { messages, sendChatMessage } = useContext(RoomContext);

    const [message, setMessage] = useState('');

    const chatDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatDivRef.current?.scrollIntoView();
    }, [messages]);

    return (
        <div className="flex h-full grow flex-col gap-y-1 rounded-md border-2 border-border bg-foreground px-4 py-3 shadow-lg shadow-border/40">
            <div className="mb-1.5 h-full grow overflow-y-scroll px-1">
                {messages.map((message, index) => (
                    <div key={index}>
                        {message.map((messageContents, contentIndex) => {
                            if (typeof messageContents === 'string') {
                                return (
                                    <span key={`${contentIndex}`} style={{}}>
                                        {messageContents}
                                    </span>
                                );
                            }
                            return (
                                <span
                                    key={`${contentIndex}`}
                                    style={{
                                        color: messageContents.color,
                                    }}
                                >
                                    {messageContents.contents}
                                </span>
                            );
                        })}
                    </div>
                ))}
                <div ref={chatDivRef} />
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
                    className="rounded-md bg-gray-200 px-3"
                    onClick={() => {
                        sendChatMessage(message);
                        setMessage('');
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
