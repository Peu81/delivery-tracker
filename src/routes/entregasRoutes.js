import {raw, Router} from 'express';
import { openDb } from '../config/dbInit.js';
import { entregasDatabase } from "../database/entregasDatabase.js";
import { autenticar } from '../middlewares/autenticacaoMiddlewares.js';
import { autorizar } from '../middlewares/autorizacaoMiddlewares.js';
import { entregasRepository } from "../repositories/entregasRepository.js";
import { entregasService } from "../services/entregasService.js";
import { entregasController as apiEntregasController} from "../controllers/api/entregasController.js";
import { motoristasRepository } from '../repositories/motoristasRepository.js';
import { motoristasService } from '../services/motoristasService.js';
import { motoristasController as apiMotoristasController} from '../controllers/api/motoristasController.js';
import { entregasController as painelEntregasController} from "../controllers/painel/entregasController.js";
import { motoristasController as painelMotoristasController} from '../controllers/painel/motoristasController.js';
import { usuariosRepository } from "../repositories/usuariosRepository.js";
import { usuariosService } from "../services/usuariosService.js";
import { usuariosController as apiUsuariosController } from "../controllers/api/usuariosController.js";
import { PrismaClient } from '@prisma/client';



const apiEntregasRouter = new Router();
const apiMotoristasRouter = new Router();
const apiUsuariosRouter = new Router();
const painelEntregasRouter = new Router();
const painelMotoristasRouter = new Router();
const painelRouter = new Router();

const prisma = new PrismaClient();
const entregaRepo = new entregasRepository(prisma);
const motoristaRepo = new motoristasRepository(prisma);
const usuariosRepo = new usuariosRepository(prisma)

const entregaService = new entregasService(entregaRepo, motoristaRepo);
const motoristaService = new motoristasService(motoristaRepo);
const usuarioService = new usuariosService(usuariosRepo);

const apiEntregaCtlr = new apiEntregasController(entregaService);
const apiMotoristaCtlr = new apiMotoristasController(motoristaService);
const apiUsuarioCtlr = new apiUsuariosController(usuarioService);

const painelEntregaCtlr = new painelEntregasController(entregaService, motoristaService);
const painelMotoristaCtlr = new painelMotoristasController(motoristaService);

apiEntregasRouter.get('/', autenticar, (req, res, next) => apiEntregaCtlr.listarTodos(req, res, next));
apiEntregasRouter.get('/:id', autenticar, (req, res, next) => apiEntregaCtlr.buscarPorId(req, res, next));
apiEntregasRouter.get('/:id/historico', autenticar, (req, res, next) => apiEntregaCtlr.historicoPorId(req, res, next));
apiEntregasRouter.post('/', autenticar, (req, res, next) => apiEntregaCtlr.criar(req, res, next));
apiEntregasRouter.patch('/:id/avancar', autenticar, (req, res, next) => apiEntregaCtlr.avancaStatus(req, res, next));
apiEntregasRouter.patch('/:id/cancelar', autenticar, autorizar('GESTOR'), (req, res, next) => apiEntregaCtlr.cancelar(req, res, next));
apiEntregasRouter.patch('/:id/atribuir', autenticar, (req, res, next) => apiEntregaCtlr.atribuiMotorista(req, res, next));

apiMotoristasRouter.post('/', autenticar, (req, res, next) => apiMotoristaCtlr.criar(req, res, next));
apiMotoristasRouter.get('/', autenticar, (req, res, next) => apiMotoristaCtlr.listarTodos(req, res, next));
apiMotoristasRouter.get('/:id', autenticar, (req, res, next) => apiMotoristaCtlr.buscarPorId(req, res, next));
apiMotoristasRouter.get('/:id/entregas', autenticar, (req, res, next) => apiEntregaCtlr.listaEntregaPorMotorista(req, res, next));
apiMotoristasRouter.patch('/:id/inativar', autenticar, autorizar('GESTOR'), (req, res, next) => apiMotoristaCtlr.inativaMotorista(req, res, next))

apiUsuariosRouter.post('/registrar', (req, res, next) => apiUsuarioCtlr.criar(req, res, next));
apiUsuariosRouter.post('/login', (req, res, next) => apiUsuarioCtlr.login(req, res, next));

painelRouter.get('/', (req, res) => {res.render('index', {titulo: 'Painel Principal'});});
painelRouter.get('/login', (req, res) => {res.render('usuarios/login', { titulo: 'Login' });});
painelRouter.get('/registrar', (req, res) => {res.render('usuarios/novo', { titulo: 'Registrar', usuario: {} });})

painelEntregasRouter.get('/', (req, res, next) => painelEntregaCtlr.index(req, res, next));
painelEntregasRouter.get('/nova', (req, res, next) => painelEntregaCtlr.formularioVazio(req, res, next));
painelEntregasRouter.post('/', (req, res, next) => painelEntregaCtlr.nova(req, res, next));
painelEntregasRouter.get('/:id', (req, res, next) => painelEntregaCtlr.detalhe(req, res, next));
painelEntregasRouter.patch('/:id/avancar', (req, res, next) => painelEntregaCtlr.avancarStatus(req, res, next));
painelEntregasRouter.patch('/:id/cancelar', autenticar, autorizar('GESTOR'), (req, res, next) => painelEntregaCtlr.cancelar(req, res, next));
painelEntregasRouter.patch('/:id/atribuiMotorista', (req, res, next) => painelEntregaCtlr.atribuiMotorista(req, res, next));


painelMotoristasRouter.get('/', (req, res, next) => painelMotoristaCtlr.index(req, res, next));
painelMotoristasRouter.get('/novo', (req, res, next) => painelMotoristaCtlr.formularioVazio(req, res, next));
painelMotoristasRouter.post('/', (req, res, next) => painelMotoristaCtlr.novo(req, res, next));


export {apiEntregasRouter, apiMotoristasRouter, apiUsuariosRouter, painelEntregasRouter, painelMotoristasRouter, painelRouter};
