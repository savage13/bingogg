import { WebSocketServer } from 'ws';
import Room from './Room';
import { RoomAction } from '../types/RoomAction';
import { verifyRoomToken } from '../auth/RoomAuth';

export const roomWebSocketServer: WebSocketServer = new WebSocketServer({
    noServer: true,
});

export const allRooms = new Map<string, Room>();
allRooms.set(
    'cool-wheat-3271',
    new Room('Test Room', 'Ori and the Bling Forest', 'cool-wheat-3271'),
);

roomWebSocketServer.on('connection', (ws, req) => {
    if (!req.url) {
        ws.send(JSON.stringify({ action: 'unauthorized' }));
        ws.close();
        return;
    }
    const segments = req.url.split('/');
    segments.shift(); // remove leading empty segment
    const [, slug] = segments;

    // create timeout for uninitialized connections
    const timeout = setTimeout(() => {
        ws.send(JSON.stringify({ action: 'unauthorized' }));
        ws.close();
    }, 1000);

    // handlers
    ws.on('message', (message) => {
        const action: RoomAction = JSON.parse(message.toString());
        const payload = verifyRoomToken(action.authToken, slug);
        if (!payload) {
            ws.send(JSON.stringify({ action: 'unauthorized' }));
            return;
        }
        const room = allRooms.get(payload.roomSlug);
        if (!room) {
            ws.send(JSON.stringify({ action: 'unauthorized' }));
            return;
        }
        if (action.action === 'join') {
            clearTimeout(timeout);
            ws.send(JSON.stringify(room.handleJoin(action, payload, ws)));
        }

        switch (action.action) {
            case 'leave':
                ws.send(
                    JSON.stringify(
                        room.handleLeave(action, payload, action.authToken),
                    ),
                );
                ws.close();
                break;
            case 'mark':
                const markResult = room.handleMark(action, payload);
                if (markResult) {
                    ws.send(JSON.stringify(markResult));
                }
                break;
            case 'unmark':
                const unmarkResult = room.handleUnmark(action, payload);
                if (unmarkResult) {
                    ws.send(JSON.stringify(unmarkResult));
                }
                break;
            case 'chat':
                const chatResult = room.handleChat(action, payload);
                if (chatResult) {
                    ws.send(JSON.stringify(chatResult));
                }
                break;
            case 'changeColor':
                const changeColorResult = room.handleChangeColor(
                    action,
                    payload,
                );
                if (changeColorResult) {
                    ws.send(JSON.stringify(changeColorResult));
                }
                break;
        }
    });
    ws.on('close', () => {
        // cleanup
    });
});
roomWebSocketServer.on('close', () => {
    // cleanup
});
