import Link from 'next/link';
import { useEffect, useState } from 'react';

async function loadData() {
    const res = await fetch('/api/rooms');
    return res.json();
}

export default async function Rooms() {
    const roomList: { name: string; game: string; slug: string }[] =
        await loadData();
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
