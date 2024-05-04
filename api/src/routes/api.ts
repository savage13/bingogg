import { Router } from 'express';
import { getUser } from '../database/Users';
import auth from './auth/Auth';
import connect from './connect/Connect';
import connection from './connection/Connection';
import games from './games/Games';
import goals from './goals/Goals';
import oauth from './oauth/OAuth';
import registration from './registration/Registration';
import rooms from './rooms/Rooms';
import users from './users/Users';

const api = Router();

api.use('/rooms', rooms);
api.use('/games', games);
api.use('/goals', goals);
api.use('/registration', registration);
api.use('/auth', auth);
api.use('/users', users);
api.use('/connect', connect);
api.use('/oauth', oauth);
api.use('/connection', connection);

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

api.post('/logout', (req, res, next) => {
    if (!req.session.user) {
        res.sendStatus(401);
        return;
    }
    req.session.user = undefined;
    req.session.save((err) => {
        if (err) {
            next(err);
            return;
        }
        req.session.destroy((destErr) => {
            if (destErr) {
                next(destErr);
                return;
            }
            res.sendStatus(200);
        });
    });
});

export default api;
