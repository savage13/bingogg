import { Prisma } from '@prisma/client';
import { prisma } from '../Database';
import { logError } from '../../Logger';

export const goalsForGame = (slug: string) => {
    return prisma.goal.findMany({ where: { game: { slug } } });
};

export const createGoal = (
    gameSlug: string,
    goal: string,
    description?: string,
    categories?: string[],
    difficulty?: number,
) => {
    return prisma.goal.create({
        data: {
            goal,
            description,
            categories,
            difficulty,
            game: { connect: { slug: gameSlug } },
        },
    });
};

export const editGoal = async (id: string, data: Prisma.GoalUpdateInput) => {
    try {
        await prisma.goal.update({ where: { id }, data });
        return true;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2001') {
                return false;
            }
            logError(`Database Known Client error - ${e.message}`);
        }
        logError(
            'An unknown error occurred while attempting a database operation',
        );
        return false;
    }
};

export const deleteGoal = async (id: string) => {
    try {
        await prisma.goal.delete({ where: { id } });
        return true;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2001') {
                return false;
            }
            logError(`Database Known Client error - ${e.message}`);
        }
        logError(
            'An unknown error occurred while attempting a database operation',
        );
        return false;
    }
};
