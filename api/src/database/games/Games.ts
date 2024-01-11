import { prisma } from '../Database';

export const allGames = () => {
    return prisma.game.findMany();
};

export const gameForSlug = (slug: string) => {
    return prisma.game.findUnique({
        where: { slug },
        include: { owners: true, moderators: true },
    });
};

export const createGame = (
    name: string,
    slug: string,
    coverImage?: string,
    owners?: string[],
    moderators?: string[],
) => {
    return prisma.game.create({
        data: {
            name,
            slug,
            coverImage,
            owners: {
                connect: owners?.map((o) => ({ id: o })),
            },
            moderators: {
                connect: moderators?.map((m) => ({ id: m })),
            },
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
