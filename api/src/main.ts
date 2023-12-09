import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

app.listen(8000, () => {
    console.log('server started');
});
