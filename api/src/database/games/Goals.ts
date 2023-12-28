import { prisma } from '../Database';

export const goalsForGame = (slug: string) => {
    return prisma.goal.findMany({ where: { game: { slug } } });
};

export const createGoal = (
    gameSlug: string,
    goal: string,
    description?: string,
) => {
    return prisma.goal.create({
        data: {
            goal,
            description,
            game: { connect: { slug: gameSlug } },
        },
    });
};
