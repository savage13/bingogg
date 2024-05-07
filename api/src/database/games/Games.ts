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

export const updateSRLv5Enabled = (slug: string, enableSRLv5: boolean) => {
    return prisma.game.update({ where: { slug }, data: { enableSRLv5 } });
};

export const updateRacetimeCategory = (
    slug: string,
    racetimeCategory: string,
) => {
    return prisma.game.update({ where: { slug }, data: { racetimeCategory } });
};

export const updateRacetimeGoal = (slug: string, racetimeGoal: string) => {
    return prisma.game.update({ where: { slug }, data: { racetimeGoal } });
};

export const getRacetimeConfiguration = (slug: string) => {
    return prisma.game.findUnique({
        select: { racetimeCategory: true, racetimeGoal: true },
        where: { slug },
    });
};

export const addOwners = (slug: string, users: string[]) => {
    return prisma.game.update({
        where: { slug },
        data: { owners: { connect: users.map((user) => ({ id: user })) } },
    });
};

export const addModerators = (slug: string, users: string[]) => {
    return prisma.game.update({
        where: { slug },
        data: { moderators: { connect: users.map((user) => ({ id: user })) } },
    });
};

export const removeOwner = (slug: string, user: string) => {
    return prisma.game.update({
        where: { slug },
        data: { owners: { disconnect: { id: user } } },
    });
};

export const removeModerator = (slug: string, user: string) => {
    return prisma.game.update({
        where: { slug },
        data: { moderators: { disconnect: { id: user } } },
    });
};

export const isOwner = async (slug: string, user: string) => {
    return (
        (await prisma.game.count({
            where: { slug, owners: { some: { id: user } } },
        })) > 0
    );
};

export const isModerator = async (slug: string, user: string) => {
    return (
        (await prisma.game.count({
            where: {
                AND: [
                    { slug },
                    {
                        OR: [
                            { owners: { some: { id: user } } },
                            { moderators: { some: { id: user } } },
                        ],
                    },
                ],
            },
        })) > 0
    );
};
