import { Router } from 'express';
import { getAllUsers } from '../../database/Users';

const users = Router();

users.get('/', async (req, res) => {
    const userList = await getAllUsers();
    res.status(200).json(userList);
});

export default users;
