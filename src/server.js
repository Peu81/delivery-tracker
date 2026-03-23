import express from 'express';
import morgan from 'morgan';
import { entregasRouter } from './routes/entregas.routes.js';


const app = express();

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(":method :url :status Body: :body "));

app.use('/api/entregas', entregasRouter);

app.use((err, req, res, next) => {
    res.status(400).json({
        erro: true,
        mensagem: err.message
    });
});

const porta = 3000;
app.listen(porta);