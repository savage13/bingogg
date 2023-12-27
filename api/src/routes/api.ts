import { Router } from 'express';
import rooms from './rooms/Rooms';
import games from './games/Games';

const api = Router();

api.use('/rooms', rooms);
api.use('/games', games);

export default api;
