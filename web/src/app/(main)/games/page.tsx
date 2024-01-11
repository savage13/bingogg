'use client';
import Link from 'next/link';
import { Game } from '@/types/Game';
import { useApi } from '../../../lib/Hooks';
import { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';

export default function Games() {
    const { loggedIn } = useContext(UserContext);

    const { data: games, isLoading, error } = useApi<Game[]>('/api/games');

    if (!games || isLoading) {
        return null;
    }

    if (error) {
        return 'Unable to load game list.';
    }

    return (
        <>
            <div className="flex items-center border-b pb-4">
                {games.length} games loaded
                <div className="grow" />
                {loggedIn && (
                    <div>
                        <Link
                            className="rounded-md border bg-green-700 p-2"
                            href="/games/new"
                        >
                            Create a new game
                        </Link>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-4 pt-2">
                {games.map((game) => (
                    <Link
                        key={game.slug}
                        className="flex basis-1/6 flex-col gap-y-1"
                        href={`/games/${game.slug}`}
                    >
                        {game.coverImage && (
                            <div
                                className="bg-cover bg-center bg-no-repeat pt-[133%]"
                                style={{
                                    backgroundImage: `url(${game.coverImage})`,
                                }}
                            />
                        )}
                        {!game.coverImage && (
                            <div className="relative flex border pt-[133%] text-4xl shadow-[inset_0_0_12px_white]">
                                <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                                    {game.slug}
                                </div>
                            </div>
                        )}
                        <div>{game.name}</div>
                    </Link>
                ))}
            </div>
        </>
    );
}
