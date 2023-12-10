import { ReactNode } from 'react';

async function loadData() {
    const res = await fetch('http://localhost:8000/api/games');
    return res.json();
}

export default async function Home() {
    const games: string[] = await loadData();
    return (
        <>
            <div className="pb-4">Welcome to bingo.gg</div>
            <div className="flex flex-col items-center justify-center gap-y-4 rounded-md border p-4 shadow-lg">
                <div className="text-4xl">Create a Room</div>
                <div className="flex flex-col gap-y-4">
                    <InlineLabel label="Room Name">
                        <input type="text" className="rounded-md" />
                    </InlineLabel>
                    <InlineLabel label="Nickname">
                        <input type="text" className="rounded-md" />
                    </InlineLabel>
                    <InlineLabel label="Game">
                        <select className="rounded-md p-1">
                            {games.map((game) => (
                                <option key={game}>{game}</option>
                            ))}
                        </select>
                    </InlineLabel>
                    <InlineLabel label="Variant">
                        <input type="text" className="rounded-md" />
                    </InlineLabel>
                    <InlineLabel label="Game Mode">
                        <select className="rounded-md p-1">
                            <option>Lines</option>
                            <option>Blackout</option>
                            <option>Lockout</option>
                        </select>
                    </InlineLabel>
                    <div className="flex">
                        <div className="grow" />
                        <button className="rounded-md border bg-gray-600 px-2 py-1 shadow-sm transition-all duration-200 hover:bg-gray-700">
                            Create Room
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

interface InlineLabelProps {
    label: string;
    children: ReactNode;
}

function InlineLabel({ label, children }: InlineLabelProps) {
    return (
        <label className="flex justify-center gap-x-8 text-xl">
            <span className="w-1/2 text-right">{label}</span>
            <div className="grow text-black">{children}</div>
        </label>
    );
}
