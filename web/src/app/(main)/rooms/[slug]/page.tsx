'use client';
import { useContext, useState } from 'react';
import Board from '@/components/board/Board';
import RoomLogin from '@/components/room/RoomLogin';
import { ConnectionStatus, RoomContext } from '@/context/RoomContext';
import ColorSelect from '@/components/room/ColorSelect';
import RoomInfo from '@/components/room/RoomInfo';
import ConnectionState from '@/components/room/ConnectionState';
import RoomChat from '@/components/room/RoomChat';

export default function Room() {
    const { connectionStatus, sendChatMessage, messages } =
        useContext(RoomContext);
    const [message, setMessage] = useState('');

    if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
        return <RoomLogin />;
    }

    // if (connectionStatus === ConnectionStatus.CLOSED) {
    //     return (
    //         <>
    //             The connection has been closed. Try logging in again.
    //             <RoomLogin />
    //         </>
    //     );
    // }

    return (
        <div className="flex gap-x-8">
            <div className="block w-1/2">
                <div className="pb-4">
                    <ColorSelect />
                </div>
                <Board />
            </div>
            <div className="grow" />
            <div className="flex flex-col gap-y-4">
                <div>
                    <RoomInfo />
                </div>
                <div>
                    <ConnectionState />
                </div>
                <div>
                    <RoomChat />
                </div>
            </div>
        </div>
    );
}
