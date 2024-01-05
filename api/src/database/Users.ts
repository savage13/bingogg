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
    password: string,
    salt: string,
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
