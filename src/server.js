import express from 'express';
import { entregasRouter } from './routes/entregas.routes.js';

const app = express();

app.use(express.json());

app.use('/', entregasRouter);

const porta = 3000;
app.listen(porta);