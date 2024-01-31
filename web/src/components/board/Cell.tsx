'use client';
import { useCallback, useContext, useState } from 'react';
import { Cell } from '../../types/Cell';
import TextFit from '../TextFit';
import { RoomContext } from '../../context/RoomContext';
import {
    useFloating,
    useHover,
    useInteractions,
    useTransitionStyles,
} from '@floating-ui/react';

interface CellProps {
    cell: Cell;
    row: number;
    col: number;
}

export default function Cell({
    cell: { goal, description, colors },
    row,
    col,
}: CellProps) {
    // context
    const { color, markGoal, unmarkGoal } = useContext(RoomContext);

    // callbacks
    const toggleSpace = useCallback(() => {
        if (colors.includes(color)) {
            unmarkGoal(row, col);
        } else {
            markGoal(row, col);
        }
    }, [row, col, markGoal, unmarkGoal, color, colors]);

    // description tooltip
    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
        open: descriptionOpen,
        onOpenChange: setDescriptionOpen,
    });
    const hover = useHover(context, { restMs: 500 });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
    const { isMounted, styles } = useTransitionStyles(context, {
        initial: {
            opacity: 0,
        },
        duration: 200,
    });

    // calculations
    const colorPortion = 360 / colors.length;

    return (
        <>
            <div
                className="relative aspect-square grow cursor-pointer overflow-hidden border bg-black transition-all duration-300 hover:z-10 hover:scale-110 hover:shadow-xl"
                onClick={toggleSpace}
                ref={refs.setReference}
                {...getReferenceProps()}
                // style={{ width: 50 }}
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
            {isMounted && description.length > 0 && (
                <div
                    ref={refs.setFloating}
                    style={{ ...floatingStyles, ...styles }}
                    {...getFloatingProps()}
                    className="z-20 max-w-md rounded-lg border border-gray-300 bg-slate-100 p-2 text-sm text-slate-700 shadow-md"
                >
                    {description}
                </div>
            )}
        </>
    );
}
