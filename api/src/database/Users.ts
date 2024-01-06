import { prisma } from './Database';

export const userByEmail = (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const userByUsername = (username: string) => {
    return prisma.user.findUnique({ where: { username } });
};

export const emailUsed = async (email: string) => {
    const user = await userByEmail(email);
    if (user) {
        return true;
    }
    return false;
};

export const usernameUsed = async (username: string) => {
    const user = await userByUsername(username);
    if (user) {
        return true;
    }
    return false;
};

export const registerUser = async (
    email: string,
    username: string,
    password: Buffer,
    salt: Buffer,
) => {
    try {
        await prisma.user.create({
            data: { email, username, password, salt },
        });
        return true;
    } catch {
        return false;
    }
};

export const getSiteAuth = async (username: string) => {
    const user = await prisma.user.findUnique({
        select: { id: true, password: true, salt: true },
        where: { username },
    });
    if (!user) {
        return undefined;
    }
    return user;
};

export const getUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        return undefined;
    }
    return {
        id: user.id,
        username: user.username,
    };
};
