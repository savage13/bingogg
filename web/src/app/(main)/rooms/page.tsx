'use client';
import Link from 'next/link';
import { useApi } from '../../../lib/Hooks';
import { RoomData } from '../../../types/RoomData';

export default function Rooms() {
    const {
        data: roomList,
        isLoading,
        error,
    } = useApi<RoomData[]>('/api/rooms');

    if (isLoading || !roomList) {
        return null;
    }
    if (error) {
        return 'Unable to load room list.';
    }

    return (
        <div>
            {roomList.map((room) => (
                <div key={room.slug}>
                    <Link href={`/rooms/${room.slug}`}>
                        <div className="w-fit border px-4 py-2">
                            <div className="pb-3 text-2xl font-bold">
                                {room.name}
                            </div>
                            <div className="text-md">{room.game}</div>
                            <div className="text-sm">{room.slug}</div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
