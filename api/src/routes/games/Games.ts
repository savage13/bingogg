import { Router } from 'express';
import {
    allGames,
    createGame,
    gameForSlug,
    updateGameCover,
    updateGameName,
} from '../../database/games/Games';

const games = Router();

games.get('/', async (req, res) => {
    const result = await allGames();
    res.status(200).json(result);
});

games.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    const result = await gameForSlug(slug);
    if (result) {
        res.status(200).json(result);
    } else {
        res.sendStatus(404);
    }
});

games.post('/', async (req, res) => {
    const { name, slug, coverImage } = req.body;
    if (!name) {
        res.status(400).send('Missing game name');
        return;
    }
    if (!slug) {
        res.status(400).send('Missing game slug');
        return;
    }
    const result = await createGame(name, slug, coverImage);
    res.status(200).json(result);
});

games.post('/:slug', (req, res) => {
    const { slug } = req.params;
    const { name, coverImage } = req.body;

    let result = undefined;
    if (name) {
        result = updateGameName(slug, name);
    }
    if (coverImage) {
        result = updateGameCover(slug, coverImage);
    }

    if (!result) {
        res.status(400).send('No changes provided');
        return;
    }

    res.status(200).json(result);
});

export default games;
