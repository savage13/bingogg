import bodyParser from 'body-parser';
import express from 'express';
import { logInfo } from './Logger';
import { port } from './Environment';
import api from './routes/api';
import { allRooms } from './routes/rooms/Rooms';

const app = express();
app.use(bodyParser.json());

app.use('/api', api);

const server = app.listen(port, () => {
    logInfo(`API application listening on port ${port}`);
});

server.on('upgrade', (req, socket, head) => {
    if (!req.url) {
        socket.destroy();
        return;
    }
    const segments = req.url.split('/');
    segments.shift(); // remove leading empty segment
    if (segments.length < 2) {
        socket.destroy();
        return;
    }
    const [target, slug] = segments;
    if (target === 'rooms') {
        const room = allRooms.get(slug);
        if (!room) {
            return;
        }
        room.websocketServer.handleUpgrade(req, socket, head, (ws) => {
            room.websocketServer.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});
