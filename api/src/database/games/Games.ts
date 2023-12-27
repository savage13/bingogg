import { prisma } from '../Database';

export const allGames = () => {
    return prisma.game.findMany();
};

export const gameForSlug = (slug: string) => {
    return prisma.game.findUnique({ where: { slug } });
};

export const createGame = (name: string, slug: string, coverImage?: string) => {
    return prisma.game.create({
        data: {
            name,
            slug,
            coverImage,
        },
    });
};

export const deleteGame = (slug: string) => {
    return prisma.game.delete({ where: { slug } });
};

export const updateGameName = (slug: string, name: string) => {
    return prisma.game.update({ where: { slug }, data: { name } });
};

export const updateGameCover = (slug: string, coverImage: string) => {
    return prisma.game.update({ where: { slug }, data: { coverImage } });
};
