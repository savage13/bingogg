import { useContext } from 'react';
import { RoomContext } from '../../context/RoomContext';
import Cell from './Cell';

export default function Board() {
    const { board } = useContext(RoomContext);
    return (
        <div className="aspect-square max-h-full max-w-full border">
            {board.board.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex h-1/5 items-center justify-center text-center"
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
        </div>
    );
}
