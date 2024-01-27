import RoomCreateForm from '@/components/RoomCreateForm';

export default async function Home() {
    return (
        <>
            <div className="pb-8">
                <div className="text-center text-5xl">Welcome to bingo.gg</div>
                <div className="mt-0.5 text-center italic">
                    The new way to bingo.
                </div>
            </div>
            <div className="flex gap-x-8">
                <div className="flex grow basis-1/2 flex-col items-center gap-y-4 rounded-md border-4 border-border bg-foreground px-16 py-4 shadow-lg shadow-border/20">
                    <div className="pb-2 text-3xl">Join an Existing Room</div>
                </div>
                <div className="flex items-center text-3xl">or</div>
                <div className="flex grow basis-1/2 flex-col items-center justify-center gap-y-4 rounded-md border-4 border-border bg-foreground px-16 py-4 shadow-lg shadow-border/20">
                    <div className="pb-2 text-4xl">Create a New Room</div>
                    <RoomCreateForm />
                </div>
            </div>
        </>
    );
}
