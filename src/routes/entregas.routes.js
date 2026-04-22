
import {raw, Router} from 'express';
import { entregasDatabase } from "../database/entregas.database.js";
import { entregasRepository } from "../repositories/entregas.repository.js";
import { entregasService } from "../services/entregas.service.js";
import { entregasController } from "../controllers/entregas.controller.js";
import { motoristasRepository } from '../repositories/motoristas.repository.js';
import { motoristasService } from '../services/motoristas.service.js';
import { motoristasController } from '../controllers/motoristas.controller.js';



const entregasRouter = new Router();
const motoristasRouter = new Router();

const database = new entregasDatabase();
const entregaRepo = new entregasRepository(database);
const motoristaRepo = new motoristasRepository(database)
const entregaService = new entregasService(entregaRepo, motoristaRepo);
const motoristaService = new motoristasService(motoristaRepo)
const entregaController = new entregasController(entregaService);
const motoristaController = new motoristasController(motoristaService);

entregasRouter.get('/', (req, res, next) => entregaController.listarTodos(req, res, next));
entregasRouter.get('/:id', (req, res, next) => entregaController.buscarPorId(req, res, next));
entregasRouter.get('/:id/historico', (req, res, next) => entregaController.historicoPorId(req, res, next));
entregasRouter.post('/', (req, res, next) => entregaController.criar(req, res, next));
entregasRouter.patch('/:id/avancar', (req, res, next) => entregaController.avancaStatus(req, res, next));
entregasRouter.patch('/:id/cancelar', (req, res, next) => entregaController.cancelar(req, res, next));
entregasRouter.patch('/:id/atribuir', (req, res, next) => entregaController.atribuiMotorista(req, res, next));
motoristasRouter.post('/', (req, res, next) => motoristaController.criar(req, res, next));
motoristasRouter.get('/', (req, res, next) => motoristaController.listarTodos(req, res, next));
motoristasRouter.get('/:id', (req, res, next) => motoristaController.buscarPorId(req, res, next));
motoristasRouter.get('/:id/entregas', (req, res, next) => entregaController.listaEntregaPorMotorista(req, res, next));
motoristasRouter.patch('/:id/inativar', (req, res, next) => motoristaController.inativaMotorista(req, res, next))



export {entregasRouter};
export {motoristasRouter};