import { OPEN, WebSocketServer } from 'ws';

/**
 * Represents a room in the bingo.gg service. A room is container for a single
 * "game" of bingo, containing, the board, game state, history, and all other
 * game level data.
 */
export default class Room {
    name: string;
    game: string;
    password: string;
    slug: string;
    websocketServer: WebSocketServer;

    constructor(name: string, game: string, slug: string) {
        this.name = name;
        this.game = game;
        this.password = 'password';
        this.slug = slug;

        // initialize the websocket server
        this.websocketServer = new WebSocketServer({ noServer: true });
        this.websocketServer.on('connection', (ws) => {
            this.sendMessageToAll('join');
            ws.on('message', (message) => {
                this.sendMessageToAll(message.toString());
            });
            ws.on('close', () => {
                this.sendMessageToAll('leave');
            });
        });
        this.websocketServer.on('close', () => {
            this.sendMessageToAll('leave');
        });
    }

    sendMessageToAll(message: string) {
        this.websocketServer.clients.forEach((client) => {
            if (client.readyState === OPEN) {
                client.send(message.toString());
            }
        });
    }
}
