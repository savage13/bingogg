import bodyParser from 'body-parser';
import express from 'express';
import { logDebug, logInfo } from './Logger';
import { port } from './Environment';
import api from './routes/api';
import { allRooms, roomWebSocketServer } from './core/RoomServer';
import { disconnect } from './database/Database';

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});
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
        roomWebSocketServer.handleUpgrade(req, socket, head, (ws) => {
            roomWebSocketServer.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

const cleanup = async () => {
    logDebug('Server shutting down');
    await Promise.all([
        new Promise((resolve) => {
            roomWebSocketServer.close(() => {
                logDebug('Room WebSocket server closed');
                resolve(undefined);
            });
            logDebug('Closing open websocket connections');
            roomWebSocketServer.clients.forEach((client) => {
                client.close();
            });
        }),
        new Promise((resolve) => {
            server.close(() => {
                logDebug('HTTP server closed');
                resolve(undefined);
            });
            logDebug('Closing open server connections');
            server.closeAllConnections();
        }),
        new Promise(async (resolve) => {
            logDebug('Closing database connection');
            await disconnect();
            logDebug('Database connection closed');
            resolve(undefined);
        }),
    ]);
    process.exit(0);
};

process.on('exit', () => {
    logInfo('API server shut down');
});

process.on('SIGHUP', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

process.once('SIGUSR2', cleanup);
