import { Board, Cell } from '@/types/Board';

type BoardEvent =
    | {
          action: 'cell';
          row: number;
          col: number;
          cell: Cell;
      }
    | {
          action: 'board';
          board: Board;
      };

let board: Board = { board: [] };
let listeners: (() => void)[] = [];

export const subscribeToBoardUpdates = (listener: () => void) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
};

export const emitBoardUpdate = (event: BoardEvent) => {
    switch (event.action) {
        case 'board':
            board = event.board;
            break;
        case 'cell':
            const newCells = board.board.map((row) => row.map((cell) => cell));
            newCells[event.row][event.col] = event.cell;
            board = { board: newCells };
            break;
    }
    listeners.forEach((listener) => {
        listener();
    });
};

export const getBoardSnapshot = () => board;
