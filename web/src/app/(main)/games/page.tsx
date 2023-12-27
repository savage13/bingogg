import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/types/Game';
import TextFit from '../../../components/TextFit';

async function loadData(): Promise<Game[]> {
    const res = await fetch('http://localhost:8000/api/games');
    return res.json();
}

export default async function Games() {
    const games = await loadData();
    return (
        <>
            <div className="flex items-center border-b pb-4">
                {games.length} games loaded
                <div className="grow" />
                <div>
                    <Link
                        className="rounded-md border bg-green-700 p-2"
                        href="/games/new"
                    >
                        Create a new game
                    </Link>
                </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-4 pt-2">
                {games.map((game) => (
                    <div
                        key={game.slug}
                        className="flex basis-1/6 flex-col gap-y-1"
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
                    </div>
                ))}
            </div>
        </>
    );
}
