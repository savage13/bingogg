import Link from 'next/link';
import { useEffect, useState } from 'react';

async function loadData() {
    const res = await fetch('http://localhost:8000/api/rooms');
    return res.json();
}

export default async function Rooms() {
    const roomList: { name: string; game: string; slug: string }[] =
        await loadData();
    return (
        <div>
            {roomList.map((room) => (
                <div key={room.slug}>
                    <Link href={`/rooms/${room.slug}`}>{room.slug}</Link>
                </div>
            ))}
        </div>
    );
}
