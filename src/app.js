import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import methodOverride from 'method-override';
import { middlewareDeErros } from './middlewares/errosMiddlewares.js';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';
import expressLayouts from 'express-ejs-layouts';
import routes from './routes/index.js';

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));
app.use(expressLayouts);
app.set('layout', 'layouts/base');
app.use(methodOverride(function (req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(morgan(":method :url :status Body: :body "));
app.use(routes);
app.use(middlewareDeErros);

// Exporta o app SEM INICIAR O SERVIDOR (Isso salva a vida dos testes de integração!)
export default app;