import bodyParser from 'body-parser';
import express from 'express';
import { logInfo } from './Logger';
import { port } from './Environment';
import api from './routes/api';

const app = express();
app.use(bodyParser.json());

app.use('/api', api);

app.listen(port, () => {
    logInfo(`API application listening on port ${port}`);
});
