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
    const { connectionStatus, roomData } = useContext(RoomContext);

    if (connectionStatus === ConnectionStatus.UNINITIALIZED) {
        return <RoomLogin />;
    }

    // something went wrong attempting to connect to the server, show the login
    // page which when submitted will restart the connection process, or show an
    // adequate error message on failure
    if (connectionStatus === ConnectionStatus.CLOSED && !roomData) {
        return <RoomLogin />;
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
