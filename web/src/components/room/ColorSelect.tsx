import { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';

export default function ColorSelect() {
    const { changeColor } = useContext(RoomContext);

    const colors = ['blue', 'red', 'orange', 'green', 'purple'];

    return (
        <div className="flex justify-center gap-x-4">
            {colors.map((color) => (
                <div
                    key={color}
                    className="cursor-pointer rounded-md border px-2 py-1 hover:scale-105 hover:bg-opacity-50"
                    style={{ backgroundColor: color }}
                    onClick={() => changeColor(color)}
                >
                    {color}
                </div>
            ))}
        </div>
    );
}
