import { Router } from "express";
import { prisma } from "../../config/dbInit.js";
import { motoristasRepository } from "../../repositories/motoristasRepository.js";
import { motoristasService } from "../../services/motoristasService.js";
import { motoristasController as apiMotoristasController } from "../../controllers/api/motoristasController.js";
import { entregasRepository } from "../../repositories/entregasRepository.js";
import { entregasService } from "../../services/entregasService.js";
import { entregasController as apiEntregasController } from "../../controllers/api/entregasController.js";
import { autenticar } from '../../middlewares/autenticacaoMiddlewares.js';
import { autorizar } from '../../middlewares/autorizacaoMiddlewares.js';

const router = new Router();

const motoristaRepo = new motoristasRepository(prisma);
const motoristaService = new motoristasService(motoristaRepo);
const apiMotoristaCtlr = new apiMotoristasController(motoristaService);

const entregaRepo = new entregasRepository(prisma);
const entregaService = new entregasService(entregaRepo, motoristaRepo);
const apiEntregaCtlr = new apiEntregasController(entregaService);


router.post('/', autenticar, autorizar('GESTOR'), (req, res, next) => apiMotoristaCtlr.criar(req, res, next));
router.get('/', autenticar, (req, res, next) => apiMotoristaCtlr.listarTodos(req, res, next));
router.get('/:id', autenticar, (req, res, next) => apiMotoristaCtlr.buscarPorId(req, res, next));
router.get('/:id/entregas', autenticar, autorizar('GESTOR'), (req, res, next) => apiEntregaCtlr.listaEntregaPorMotorista(req, res, next));
router.patch('/:id/inativar', autenticar, autorizar('GESTOR'), (req, res, next) => apiMotoristaCtlr.atualizaStatus(req, res, next))

export default router;