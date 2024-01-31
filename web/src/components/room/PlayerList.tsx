const players = [
    'player 1',
    'player 2',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
    'player 3',
];
export default function PlayerList() {
    return (
        <div className="block max-h-full overflow-y-auto rounded-md border border-border bg-foreground px-3 py-2">
            <div className="pb-1 text-lg font-semibold">Connected Players</div>
            <div className="">
                {players.map((player) => (
                    <div key={player} className="flex gap-x-2">
                        <div className="rounded-md border px-1">0</div>
                        <div>{player}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
