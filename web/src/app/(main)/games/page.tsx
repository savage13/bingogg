async function loadData() {
    const res = await fetch('http://localhost:8000/api/games');
    return res.json();
}

export default async function Games() {
    const games: string[] = await loadData();
    return (
        <div>
            {games.map((game) => (
                <div key={game}>{game}</div>
            ))}
        </div>
    );
}
