import { ReactNode } from 'react';
import { RoomContextProvider } from '@/context/RoomContext';

export default function RoomLayout({
    params: { slug },
    children,
}: {
    params: { slug: string };
    children: ReactNode;
}) {
    return (
        <>
            <RoomContextProvider slug={slug}>{children}</RoomContextProvider>
        </>
    );
}
