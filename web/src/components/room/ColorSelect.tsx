'use client';
import { useContext, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useClickAway, useLocalStorage } from 'react-use';
import { RoomContext } from '../../context/RoomContext';

export default function ColorSelect() {
    const { color, changeColor } = useContext(RoomContext);

    const colors = ['blue', 'red', 'orange', 'green', 'purple'];

    const [storedCustomColor, setStoredCustomColor] = useLocalStorage(
        'bingogg.customcolor',
        '',
    );

    const [customColor, setCustomColor] = useState(storedCustomColor ?? '');
    const [picker, setPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useClickAway(pickerRef, () => {
        setPicker(false);
        changeColor(customColor);
    });

    return (
        <div className="flex items-center justify-center gap-x-4">
            {colors.map((colorItem) => (
                <div
                    key={colorItem}
                    className={`${
                        color === colorItem ? 'border-4 border-white' : ''
                    } cursor-pointer rounded-md px-2 py-1 hover:scale-110 hover:bg-opacity-50`}
                    style={{ backgroundColor: colorItem }}
                    onClick={() => changeColor(colorItem)}
                >
                    {colorItem}
                </div>
            ))}
            <div className="flex flex-col">
                <div
                    className={`${
                        color === customColor ? 'border-4 border-white' : ''
                    } cursor-pointer rounded-md px-2 py-1 hover:scale-110 hover:bg-opacity-50`}
                    style={{ backgroundColor: customColor }}
                    onClick={() => setPicker(true)}
                >
                    custom
                </div>
                {picker && (
                    <div ref={pickerRef} className="absolute z-20">
                        <SketchPicker
                            color={customColor}
                            onChange={(color) => {
                                setStoredCustomColor(color.hex);
                                setCustomColor(color.hex);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
