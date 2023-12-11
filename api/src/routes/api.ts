import { Router } from 'express';
import rooms from './rooms/Rooms';

const api = Router();

api.use('/rooms', rooms);

api.get('/games', (req, res) => {
    res.send([
        'The Legend of Zelda: Breath of the Wild',
        'Super Mario 64',
        'Genshin Impact',
        'Ori and the Blind Forest',
    ]);
});

export default api;
