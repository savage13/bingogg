import { Router } from 'express';
import auth from './auth/Auth';
import games from './games/Games';
import goals from './goals/Goals';
import registration from './registration/Registration';
import rooms from './rooms/Rooms';
import { getUser } from '../database/Users';

const api = Router();

api.use('/rooms', rooms);
api.use('/games', games);
api.use('/goals', goals);
api.use('/registration', registration);
api.use('/auth', auth);

api.get('/me', async (req, res) => {
    if (!req.session.user) {
        res.sendStatus(401);
        return;
    }
    const user = await getUser(req.session.user);
    if (!user) {
        res.sendStatus(403);
        return;
    }
    res.status(200).send(user);
});

export default api;
