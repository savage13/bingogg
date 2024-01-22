import { randomInt } from 'crypto';
import { Router } from 'express';
import Room, { BoardGenerationMode } from '../../core/Room';
import { createRoomToken } from '../../auth/RoomAuth';
import { allRooms } from '../../core/RoomServer';
import { gameForSlug } from '../../database/games/Games';

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

rooms.get('/', (req, res) => {
    const roomList: { name: string; game: string; slug: string }[] = [];
    allRooms.forEach((room, key) => {
        roomList.push({ name: room.name, game: room.game, slug: key });
    });
    res.send(roomList);
});

rooms.post('/', async (req, res) => {
    const { name, game, nickname, password, variant, mode, generationMode } =
        req.body;

    if (!name || !game || !nickname || !variant || !mode) {
        res.status(400).send('Missing required element(s).');
        return;
    }

    const gameData = await gameForSlug(game);
    if (!gameData) {
        res.sendStatus(404);
        return;
    }

    const slug = `${slugList[randomInt(0, slugList.length)]}-${
        slugList[randomInt(0, slugList.length)]
    }-${randomInt(1000, 10000)}`;
    const room = new Room(name, gameData.name, game, slug, password);
    let genMode;
    if (generationMode) {
        genMode = generationMode;
    } else {
        if (gameData.enableSRLv5) {
            genMode = BoardGenerationMode.SRLv5;
        } else {
            genMode = BoardGenerationMode.RANDOM;
        }
    }
    await room.generateBoard(genMode);
    allRooms.set(slug, room);

    const token = createRoomToken(room);

    res.status(200).json({ slug, authToken: token });
});

rooms.post('/:slug/authorize', (req, res) => {
    const { slug } = req.params;
    const { password } = req.body;
    const room = allRooms.get(slug);
    if (!room) {
        res.sendStatus(404);
        return;
    }
    if (password !== room.password) {
        res.sendStatus(403);
        return;
    }
    const token = createRoomToken(room);
    res.status(200).send({ authToken: token });
});

export default rooms;
