import { JwtPayload, sign, verify } from 'jsonwebtoken';
import Room from '../core/Room';
import { roomTokenSecret } from '../Environment';

export type RoomTokenPayload = {
    roomSlug: string;
    nickname: string;
};

export const createRoomToken = (nickname: string, room: Room) => {
    const payload: RoomTokenPayload = {
        roomSlug: room.slug,
        nickname,
    };
    const token = sign(payload, roomTokenSecret);
    return token;
};

export const verifyRoomToken = (token: string) => {
    return verify(token, roomTokenSecret) as JwtPayload;
};
