import { Router } from "express";
import { prisma } from "../../config/dbInit.js";
import { entregasRepository } from "../../repositories/entregasRepository.js";
import { motoristasRepository } from "../../repositories/motoristasRepository.js";
import { entregasService } from "../../services/entregasService.js";
import { entregasController as apiEntregasController } from "../../controllers/api/entregasController.js";
import { autenticar } from '../../middlewares/autenticacaoMiddlewares.js';
import { autorizar } from '../../middlewares/autorizacaoMiddlewares.js';

const router = new Router();

const entregaRepo = new entregasRepository(prisma);
const motoristaRepo = new motoristasRepository(prisma);
const entregaService = new entregasService(entregaRepo, motoristaRepo);
const apiEntregaCtlr = new apiEntregasController(entregaService);


router.get('/', autenticar, (req, res, next) => apiEntregaCtlr.listarTodos(req, res, next));
router.get('/:id', autenticar, (req, res, next) => apiEntregaCtlr.buscarPorId(req, res, next));
router.get('/:id/historico', autenticar, (req, res, next) => apiEntregaCtlr.historicoPorId(req, res, next));
router.post('/', autenticar, (req, res, next) => apiEntregaCtlr.criar(req, res, next));
router.patch('/:id/avancar', autenticar,(req, res, next) => apiEntregaCtlr.avancaStatus(req, res, next));
router.patch('/:id/cancelar', autenticar, autorizar('GESTOR'), (req, res, next) => apiEntregaCtlr.cancelar(req, res, next));
router.patch('/:id/atribui', autenticar, (req, res, next) => apiEntregaCtlr.atribuiMotorista(req, res, next));

export default router;