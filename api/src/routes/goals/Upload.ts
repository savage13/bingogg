import { Router } from 'express';
import { gameForSlug, isOwner } from '../../database/games/Games';
import { createGoals } from '../../database/games/Goals';

const upload = Router();

upload.post('/srlv5', async (req, res) => {
    const { slug, goals } = req.body;

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
    if (!goals) {
        res.status(400).send('Missing goal list');
        return;
    }
    if (!Array.isArray(goals)) {
        res.status(400).send('Invalid goal list format');
    }

    if (!gameForSlug(slug)) {
        res.sendStatus(404);
        return;
    }

    await createGoals(slug, goals);
    res.sendStatus(201);
});

export default upload;
