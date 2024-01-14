import { Router } from 'express';
import { gameForSlug, isOwner } from '../../database/games/Games';
import { createGoals } from '../../database/games/Goals';
import { parseSRLv5BingoList } from '../../core/goals/SRLv5Parser';

const upload = Router();

upload.post('/srlv5', async (req, res) => {
    const { slug, input } = req.body;

    if (!req.session.user) {
        res.sendStatus(401);
        return;
    }
    if (!isOwner(slug, req.session.user)) {
        res.sendStatus(403);
        return;
    }

    if (!slug) {
        res.status(400).send('Missing game slug');
        return;
    }
    if (!input) {
        res.status(400).send('Missing game slug');
        return;
    }

    if (!gameForSlug(slug)) {
        res.sendStatus(404);
        return;
    }

    const parsedList = parseSRLv5BingoList(input);
    if (!parsedList) {
        res.status(400).send('Invalid goal input');
        return;
    }

    let invalid = false;
    const goals = parsedList
        .map((goalList, difficulty) => {
            if (invalid) {
                return [];
            }
            if (difficulty < 1 || difficulty > 25) {
                invalid = true;
                return [];
            }
            return goalList.map((goal) => {
                if (!goal.name) {
                    invalid = true;
                }
                return {
                    goal: goal.name,
                    difficulty,
                    categories: goal.types,
                };
            });
        })
        .flat();
    if (invalid) {
        res.status(400).send('Invalid goal input');
        return;
    }

    await createGoals(slug, goals);
    res.sendStatus(201);
});

export default upload;
