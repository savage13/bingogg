'use client';
import { useCallback, useContext, useState } from 'react';
import { Cell } from '../../types/Cell';
import TextFit from '../TextFit';
import { RoomContext } from '../../context/RoomContext';

interface CellProps {
    cell: Cell;
    row: number;
    col: number;
}

export default function Cell({ cell: { goal, colors }, row, col }: CellProps) {
    // context
    const { markGoal, unmarkGoal } = useContext(RoomContext);

    // state
    const [marked, setMarked] = useState(false);

    // callbacks
    const toggleSpace = useCallback(() => {
        if (marked) {
            unmarkGoal(row, col);
            setMarked(false);
        } else {
            markGoal(row, col);
            setMarked(true);
        }
    }, [row, col, markGoal, unmarkGoal, marked]);

    // calculations
    const colorPortion = 360 / colors.length;

    return (
        <div
            className="relative aspect-square w-1/5 cursor-pointer overflow-hidden border transition-all duration-300 hover:z-10 hover:scale-110 hover:shadow-xl"
            onClick={toggleSpace}
        >
            <div className="absolute z-10 flex h-full w-full items-center justify-center p-2">
                <TextFit
                    text={goal}
                    className="p-1 drop-shadow-[2px_2px_2px_rgba(0,0,0)]"
                />
            </div>
            {colors.map((color, index) => (
                <div
                    key={color}
                    className="absolute h-full w-full"
                    style={{
                        backgroundImage: `conic-gradient(from ${
                            colorPortion * index
                        }deg, ${color} 0deg, ${color} ${colorPortion}deg, rgba(0,0,0,0) ${colorPortion}deg)`,
                    }}
                />
            ))}
            {/* <div className="box absolute h-full w-full origin-top skew-x-[-0.84007rad] bg-green-400" /> */}
        </div>
    );
}
