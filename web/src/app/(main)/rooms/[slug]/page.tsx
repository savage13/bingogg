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
    const { connectionStatus, roomData, nickname, disconnect } =
        useContext(RoomContext);

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
                <div className="flex h-fit flex-col gap-y-3 rounded-md border border-border bg-foreground p-3">
                    <div className="">
                        <div className="float-left text-lg font-semibold">
                            Playing as {nickname}
                        </div>
                        {connectionStatus !== ConnectionStatus.CLOSED && (
                            <button
                                className="float-right rounded-md border bg-background px-2 py-1 shadow-md shadow-white/20 hover:bg-border"
                                onClick={disconnect}
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                    <div className="rounded-md border bg-background p-2 shadow-md shadow-white/20">
                        <div className="pb-1 font-semibold">
                            Choose your color
                        </div>
                        <ColorSelect />
                    </div>
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
