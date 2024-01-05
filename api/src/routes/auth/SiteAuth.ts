import { pbkdf2Sync } from 'crypto';
import { Router } from 'express';
import { getSiteAuth } from '../../database/Users';

const siteAuth = Router();

siteAuth.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username !== 'string') {
        res.status(400).send('invalid username - unable to parse');
        return;
    }
    if (typeof password !== 'string') {
        res.status(400).send('invalid password - unable to be parsed');
    }

    const auth = await getSiteAuth(username);
    if (!auth) {
        res.sendStatus(403);
        return;
    }
    const suppliedHash = pbkdf2Sync(
        password,
        auth.salt,
        10000,
        64,
        'sha256',
    ).toString('base64');
    if (suppliedHash !== auth.password) {
        res.sendStatus(403);
        return;
    }
    res.sendStatus(200);
});

export default siteAuth;
