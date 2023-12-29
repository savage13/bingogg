import RoomCreateForm from '../../components/RoomCreateForm';
import { loadData } from './page';

export default async function Home() {
    const games = await loadData();
    return (
        <>
            <div className="pb-4">Welcome to bingo.gg</div>
            <div className="flex flex-col items-center justify-center gap-y-4 rounded-md border p-4 shadow-lg">
                <div className="text-4xl">Create a Room</div>
                <RoomCreateForm />
            </div>
        </>
    );
}
