import { Router } from 'express';
import { deleteGoal, editGoal } from '../../database/games/Goals';
import upload from './Upload';

const goals = Router();

goals.get('/:id', (req, res) => {
    res.sendStatus(500);
});

goals.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { goal, description, categories, difficulty } = req.body;
    if (!goal && !description && !categories && !difficulty) {
        res.status(400).send('No changes submitted');
        return;
    }
    const success = await editGoal(id, {
        goal,
        description,
        categories,
        difficulty,
    });
    if (!success) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(200);
});

goals.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const success = await deleteGoal(id);
    if (!success) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(200);
});

goals.use('/upload', upload);

export default goals;
