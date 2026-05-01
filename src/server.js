import express from 'express';
import morgan from 'morgan';
import { apiEntregasRouter, apiMotoristasRouter, painelEntregasRouter, painelMotoristasRouter } from './routes/entregasRoutes.js';
import { middlewareDeErros } from './middlewares/errosMiddlewares.js';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';


const app = express();

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use(morgan(":method :url :status Body: :body "));

app.use('/api/entregas', apiEntregasRouter);
app.use('/api/motoristas', apiMotoristasRouter);
app.use('/painel/entregas', painelEntregasRouter);
app.use('/painel/motoristas', painelMotoristasRouter);
app.use(middlewareDeErros);

const porta = 3000;
app.listen(porta);

export default app;