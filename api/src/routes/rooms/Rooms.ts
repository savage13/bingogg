import { randomInt } from 'crypto';
import { Router } from 'express';
import Room from '../../core/Room';

const rooms = Router();

const slugList = [
    'cool',
    'nimble',
    'weak',
    'feeling',
    'fire',
    'rapid',
    'messy',
    'living',
    'mill',
    'flour',
    'wheat',
];

export const allRooms = new Map<string, Room>();
allRooms.set(
    'cool-wheat-3271',
    new Room('Test Room', 'Ori and the Bling Forest'),
);

rooms.get('/', (req, res) => {
    const roomList: { name: string; game: string; slug: string }[] = [];
    allRooms.forEach((room, key) => {
        roomList.push({ name: room.name, game: room.game, slug: key });
    });
    res.send(roomList);
});

rooms.post('/', (req, res) => {
    const name = 'Test Room';
    const game = 'Ori and the Blind Forest';
    const slug = `${slugList[randomInt(0, slugList.length)]}-${
        slugList[randomInt(0, slugList.length)]
    }-${randomInt(1000, 10000)}`;
    allRooms.set(slug, new Room(name, game));
    res.status(200).send(slug);
});

export default rooms;
