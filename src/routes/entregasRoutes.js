
import {raw, Router} from 'express';
import { openDb } from '../config/dbInit.js';
import { entregasDatabase } from "../database/entregasDatabase.js";
import { entregasRepository } from "../repositories/entregasRepository.js";
import { entregasService } from "../services/entregasService.js";
import { entregasController as apiEntregasController} from "../controllers/api/entregasController.js";
import { motoristasRepository } from '../repositories/motoristasRepository.js';
import { motoristasService } from '../services/motoristasService.js';
import { motoristasController as apiMotoristasController} from '../controllers/api/motoristasController.js';
import { entregasController as painelEntregasController} from "../controllers/painel/entregasController.js";
import { motoristasController as painelMotoristasController} from '../controllers/painel/motoristasController.js';
import { PrismaClient } from '@prisma/client';



const apiEntregasRouter = new Router();
const apiMotoristasRouter = new Router();
const painelEntregasRouter = new Router();
const painelMotoristasRouter = new Router();
const painelRouter = new Router();

const prisma = new PrismaClient();
const entregaRepo = new entregasRepository(prisma);
const motoristaRepo = new motoristasRepository(prisma);

const entregaService = new entregasService(entregaRepo, motoristaRepo);
const motoristaService = new motoristasService(motoristaRepo);

const apiEntregaCtlr = new apiEntregasController(entregaService);
const apiMotoristaCtlr = new apiMotoristasController(motoristaService);

const painelEntregaCtlr = new painelEntregasController(entregaService, motoristaService);
const painelMotoristaCtlr = new painelMotoristasController(motoristaService);

apiEntregasRouter.get('/', (req, res, next) => apiEntregaCtlr.listarTodos(req, res, next));
apiEntregasRouter.get('/:id', (req, res, next) => apiEntregaCtlr.buscarPorId(req, res, next));
apiEntregasRouter.get('/:id/historico', (req, res, next) => apiEntregaCtlr.historicoPorId(req, res, next));
apiEntregasRouter.post('/', (req, res, next) => apiEntregaCtlr.criar(req, res, next));
apiEntregasRouter.patch('/:id/avancar', (req, res, next) => apiEntregaCtlr.avancaStatus(req, res, next));
apiEntregasRouter.patch('/:id/cancelar', (req, res, next) => apiEntregaCtlr.cancelar(req, res, next));
apiEntregasRouter.patch('/:id/atribuir', (req, res, next) => apiEntregaCtlr.atribuiMotorista(req, res, next));

apiMotoristasRouter.post('/', (req, res, next) => apiMotoristaCtlr.criar(req, res, next));
apiMotoristasRouter.get('/', (req, res, next) => apiMotoristaCtlr.listarTodos(req, res, next));
apiMotoristasRouter.get('/:id', (req, res, next) => apiMotoristaCtlr.buscarPorId(req, res, next));
apiMotoristasRouter.get('/:id/entregas', (req, res, next) => apiEntregaCtlr.listaEntregaPorMotorista(req, res, next));
apiMotoristasRouter.patch('/:id/inativar', (req, res, next) => apiMotoristaCtlr.inativaMotorista(req, res, next))

painelRouter.get('/', (req, res) => res.redirect('/painel/entregas'));

painelEntregasRouter.get('/', (req, res, next) => painelEntregaCtlr.index(req, res, next));
painelEntregasRouter.get('/nova', (req, res, next) => painelEntregaCtlr.formularioVazio(req, res, next));
painelEntregasRouter.post('/', (req, res, next) => painelEntregaCtlr.nova(req, res, next));
painelEntregasRouter.get('/:id', (req, res, next) => painelEntregaCtlr.detalhe(req, res, next));
painelEntregasRouter.patch('/:id/avancar', (req, res, next) => painelEntregaCtlr.avancarStatus(req, res, next));
painelEntregasRouter.patch('/:id/cancelar', (req, res, next) => painelEntregaCtlr.cancelar(req, res, next));
painelEntregasRouter.patch('/:id/atribuiMotorista', (req, res, next) => painelEntregaCtlr.atribuiMotorista(req, res, next));


painelMotoristasRouter.get('/', (req, res, next) => painelMotoristaCtlr.index(req, res, next));
painelMotoristasRouter.get('/novo', (req, res, next) => painelMotoristaCtlr.formularioVazio(req, res, next));
painelMotoristasRouter.post('/', (req, res, next) => painelMotoristaCtlr.novo(req, res, next));


export {apiEntregasRouter, apiMotoristasRouter, painelEntregasRouter, painelMotoristasRouter, painelRouter};
