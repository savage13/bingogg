import { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';

export default function ColorSelect() {
    const { color, changeColor } = useContext(RoomContext);

    const colors = ['blue', 'red', 'orange', 'green', 'purple'];

    return (
        <div className="flex items-center justify-center gap-x-4">
            {colors.map((colorItem) => (
                <div
                    key={colorItem}
                    className={`${
                        color === colorItem ? 'border-4 border-white' : ''
                    } cursor-pointer rounded-md border px-2 py-1 hover:scale-105 hover:bg-opacity-50`}
                    style={{ backgroundColor: colorItem }}
                    onClick={() => changeColor(colorItem)}
                >
                    {colorItem}
                </div>
            ))}
        </div>
    );
}
