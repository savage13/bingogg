import { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';

export default function RoomInfo() {
    const { roomData } = useContext(RoomContext);

    if (!roomData) {
        return (
            <div className="rounded-md border border-white p-2 text-center">
                No Room Data found.
            </div>
        );
    }

    return (
        <div className="rounded-md border border-white px-4 py-2 text-center">
            <div className="text-3xl font-semibold">{roomData.name}</div>
            <div className="text-lg">{roomData.game}</div>
            <div className="pb-4 text-sm">{roomData.slug}</div>
            <div className="flex text-sm">
                <div>Variant</div>
                <div className="grow" />
                <div>Mode</div>
            </div>
        </div>
    );
}
