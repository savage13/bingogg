'use client';
import Board from '@/components/board/Board';
import ColorSelect from '@/components/room/ColorSelect';
import ConnectionState from '@/components/room/ConnectionState';
import RoomChat from '@/components/room/RoomChat';
import RoomInfo from '@/components/room/RoomInfo';
import RoomLogin from '@/components/room/RoomLogin';
import { ConnectionStatus, RoomContext } from '@/context/RoomContext';
import { useContext } from 'react';

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
        <>
            <div className="flex h-[30%] gap-x-4 pb-4">
                <div className="flex flex-col gap-y-3">
                    <RoomInfo />
                    <ConnectionState />
                </div>
                <div className="rounded-md border border-border bg-foreground p-4">
                    <ColorSelect />
                </div>
            </div>
            <div className="flex h-[70%] gap-x-8">
                <div className="max-h-full max-w-[50%] grow">
                    <Board />
                </div>
                <div>
                    <RoomChat />
                </div>
            </div>
        </>
    );
}
