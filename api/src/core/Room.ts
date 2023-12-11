import { OPEN, WebSocketServer } from 'ws';

/**
 * Represents a room in the bingo.gg service. A room is container for a single
 * "game" of bingo, containing, the board, game state, history, and all other
 * game level data.
 */
export default class Room {
    name: string;
    game: string;
    websocketServer: WebSocketServer;

    constructor(name: string, game: string) {
        this.name = name;
        this.game = game;

        // initialize the websocket server
        this.websocketServer = new WebSocketServer({ noServer: true });
        setInterval(() => {
            this.websocketServer.clients.forEach((client) => {
                if (client.readyState === OPEN) {
                    client.send('message');
                }
            });
        }, 1000);
    }
}
