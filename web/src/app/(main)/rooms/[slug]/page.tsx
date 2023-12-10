'use client';

import { useState } from 'react';

const board = [
    [
        'Collect 5 things',
        'Talk to 10 people',
        'A pointy device',
        'Obtain a hammer',
        'YELL',
    ],
    ['10 Wells', '15 flames', 'Beat the game', 'Die 10 times', 'Beat 5-2'],
    [
        'Beat 3-5',
        'Discover Persia',
        'Invent Religion',
        'C O N Q U E S T',
        'Meet Marco',
    ],
    [
        'Return to Madagascar',
        'Morph Ball',
        '500 HP',
        '50 coins',
        'Have a civil war',
    ],
    ['Game over', 'Kill 300 enemies', 'Explosives', 'Compass', 'Roads'],
];

export default function Room({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const [boardState, setBoardState] = useState([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ]);

    const toggleSpace = (row: number, col: number) => {
        setBoardState(
            boardState.map((rowData, rowIndex) => {
                if (rowIndex == row) {
                    return rowData.map((colData, colIndex) => {
                        if (colIndex === col) {
                            return !colData;
                        }
                        return colData;
                    });
                }
                return rowData;
            }),
        );
    };

    return (
        <div>
            {slug}
            <div>
                {board.map((row, rowIndex) => (
                    <div
                        key={row.join()}
                        className="flex w-1/2 items-center justify-center text-center"
                    >
                        {row.map((goal, colIndex) => (
                            <div
                                key={goal}
                                className={`${
                                    boardState[rowIndex][colIndex]
                                        ? 'bg-red-500'
                                        : ''
                                } aspect-square w-1/5 cursor-pointer border p-4 hover:bg-gray-300 hover:bg-opacity-25`}
                                onClick={() => toggleSpace(rowIndex, colIndex)}
                            >
                                {goal}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
