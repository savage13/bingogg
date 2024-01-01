import { Router } from 'express';
import {
    allGames,
    createGame,
    gameForSlug,
    updateGameCover,
    updateGameName,
} from '../../database/games/Games';
import { createGoal, goalsForGame } from '../../database/games/Goals';

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

games.get('/:slug/goals', async (req, res) => {
    const { slug } = req.params;
    const goals = await goalsForGame(slug);
    res.status(200).json(goals);
});

games.post('/:slug/goals', async (req, res) => {
    const { slug } = req.params;
    const { goal, description, categories, difficulty } = req.body;
    let difficultyNum: number | undefined = undefined;
    if (difficulty) {
        difficultyNum = Number(difficulty);
        if (Number.isNaN(difficultyNum)) {
            res.status(400).send('Invalid difficulty value');
            return;
        }
    }
    if (!goal) {
        res.status(400).send('Missing goal text');
        return;
    }
    const newGoal = await createGoal(
        slug,
        goal,
        description,
        categories,
        difficultyNum,
    );
    res.status(200).json(newGoal);
});

export default games;
