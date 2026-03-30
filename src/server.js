import express from 'express';
import morgan from 'morgan';
import { entregasRouter, motoristasRouter } from './routes/entregas.routes.js';
import { middlewareDeErros } from './middlewares/erros.middlewares.js';


const app = express();

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(":method :url :status Body: :body "));

app.use('/api/entregas', entregasRouter);
app.use('/api/motoristas', motoristasRouter);
app.use(middlewareDeErros)

const porta = 3000;
app.listen(porta);