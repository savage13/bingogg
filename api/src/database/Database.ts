import { PrismaClient } from '@prisma/client';
import { logError } from '../Logger';

export const prisma = new PrismaClient();
let connected = false;

export const connect = async () => {
    try {
        await prisma.$connect();
        connected = true;
    } catch (e) {
        logError('Unable to connect to database');
        logError(JSON.stringify(e));
    }
};

export const disconnect = async () => {
    if (connected) {
        await prisma.$disconnect();
    }
};

export const isConnected = () => {
    return connected;
};
