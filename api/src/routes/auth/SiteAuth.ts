import { pbkdf2Sync, timingSafeEqual } from 'crypto';
import { Router } from 'express';
import {
    getSiteAuth,
    getUserByEmail,
    initiatePasswordReset,
} from '../../database/Users';
import { sendEmail } from '../../communication/outgoing/Email';
import { urlBase } from '../../Environment';

const siteAuth = Router();

siteAuth.post('/login', async (req, res, next) => {
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
        res.sendStatus(401);
        return;
    }
    const suppliedHash = pbkdf2Sync(password, auth.salt, 10000, 64, 'sha256');
    if (!timingSafeEqual(auth.password, suppliedHash)) {
        res.sendStatus(401);
        return;
    }

    req.session.regenerate((genErr) => {
        if (genErr) {
            next();
            res.sendStatus(500);
            return;
        }
        req.session.user = auth.id;
        req.session.save((saveErr) => {
            if (saveErr) {
                next();
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

// small security note - all data related errors are sent as a 400 response,
// this prevents trying to reverse engineer certain data connections based on
// the response data
siteAuth.post('/forgotPassword', async (req, res) => {
    const { email, username } = req.body;
    if (!email || !username) {
        res.status(400);
        return;
    }
    const user = await getUserByEmail(email);
    if (!user) {
        res.sendStatus(400);
        return;
    }
    if (username !== user.username) {
        res.sendStatus(400);
        return;
    }

    const resetToken = await initiatePasswordReset(user.id);
    sendEmail(
        user.email,
        'bingo.gg Password Reset',
        // eslint-disable-next-line max-len
        `Use this link to reset your password. It only works once and expires in 10 minutes. ${urlBase}/resetpassword?token=${resetToken.token}`,
    );
    res.sendStatus(200);
});

export default siteAuth;
