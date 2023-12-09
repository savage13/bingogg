import bodyParser from 'body-parser';
import express from 'express';
import { logInfo } from './Logger';
import { port } from './Environment';

const app = express();
app.use(bodyParser.json());

app.listen(port, () => {
    logInfo(`API application listening on port ${port}`);
});
