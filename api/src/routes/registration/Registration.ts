import { Router } from 'express';
import { emailUsed, registerUser, usernameUsed } from '../../database/Users';
import { pbkdf2Sync, randomBytes } from 'crypto';

const registration = Router();

registration.get('/checkEmail', async (req, res) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
        res.sendStatus(400);
        return;
    }
    res.status(200).json({ valid: !(await emailUsed(email)) });
});

registration.get('/checkUsername', async (req, res) => {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
        res.sendStatus(400);
        return;
    }
    res.status(200).json({ valid: !(await usernameUsed(name)) });
});

registration.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (typeof email !== 'string') {
        res.status(400).send('Invalid email - unable to parse');
        return;
    }
    if (!email.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        res.status(400).send('Invalid email - invalid format');
        return;
    }
    if (await emailUsed(email)) {
        res.status(400).send('Invalid email - already used');
        return;
    }

    if (typeof username !== 'string') {
        res.status(400).send('Invalid username - unable to parse');
        return;
    }
    if (!username.match(/^[a-zA-Z0-9]*$/)) {
        res.status(400).send('Invalid username - invalid format');
    }
    if (await usernameUsed(username)) {
        res.status(400).send('Invalid username - already used');
        return;
    }

    const salt = randomBytes(16).toString('base64');
    const passwordHash = pbkdf2Sync(password, salt, 10000, 64, 'sha256');
    const result = registerUser(
        email,
        username,
        passwordHash.toString('base64'),
        salt,
    );
    if (!result) {
        res.sendStatus(400);
        return;
    }
    res.sendStatus(201);
});

export default registration;
