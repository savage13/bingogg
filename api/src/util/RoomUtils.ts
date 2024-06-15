import { Goal } from '@prisma/client';
import { chunk } from './Array';

export const listToBoard = (list: Goal[]) => {
    return chunk(
        list.map((g) => ({
            goal: `${g.goal}`,
            description: g.description ?? '',
            colors: [],
        })),
        5,
    );
};
