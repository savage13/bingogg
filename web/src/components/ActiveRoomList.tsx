import { use } from 'react';
import { RoomData } from '../types/RoomData';
import { useUnmount } from 'react-use';
import { revalidatePath } from 'next/cache';
import CacheBreaker from './CacheBreaker';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

async function getRooms(): Promise<RoomData[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/rooms`);
    return res.json();
}

export default function ActiveRoomList() {
    const rooms = use(getRooms());

    if (rooms.length === 0) {
        return <div className="italic">No active rooms</div>;
    }

    return (
        <div className="flex w-full flex-col gap-y-4 overflow-scroll">
            {rooms.map((room) => (
                <Link
                    key={room.slug}
                    className="rounded-md border bg-background p-3"
                    href={`/rooms/${room.slug}`}
                >
                    <div className="pb-1 text-2xl">{room.name}</div>
                    <div className="pb-2 text-sm">{room.slug}</div>
                    <div className="text-lg">{room.game}</div>
                </Link>
            ))}
            <CacheBreaker />
        </div>
    );
}
