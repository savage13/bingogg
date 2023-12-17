import { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';
import Cell from './Cell';

export default function Board() {
    const { board } = useContext(RoomContext);
    return (
        <>
            {board.board.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex w-full items-center justify-center text-center"
                >
                    {row.map((goal, colIndex) => (
                        <Cell
                            key={`(${rowIndex},${colIndex})`}
                            row={rowIndex}
                            col={colIndex}
                            cell={goal}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}
