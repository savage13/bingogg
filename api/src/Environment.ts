import 'dotenv/config';

export const port = process.env.PORT || 8000;
export const testing = !!process.env.TESTING;
export const roomTokenSecret = process.env.ROOM_TOKEN_SECRET || '';
