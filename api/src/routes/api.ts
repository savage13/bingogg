import { Router } from 'express';
import rooms from './rooms/Rooms';
import games from './games/Games';
import goals from './goals/Goals';
import registration from './registration/Registration';
import auth from './auth/Auth';

const api = Router();

api.use('/rooms', rooms);
api.use('/games', games);
api.use('/goals', goals);
api.use('/registration', registration);
api.use('/auth', auth);

export default api;
