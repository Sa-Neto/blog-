import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import routes from './routes/routes';
import './config/db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

export default app;
