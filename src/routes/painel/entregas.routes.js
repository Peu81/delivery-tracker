import { Router } from "express";
import { prisma } from "../../config/dbInit.js";
import { entregasRepository } from "../../repositories/entregasRepository.js";
import { motoristasRepository } from "../../repositories/motoristasRepository.js";
import { entregasService } from "../../services/entregasService.js";
import { motoristasService } from "../../services/motoristasService.js";
import { entregasController as painelEntregasController } from "../../controllers/painel/entregasController.js";
import { autenticar } from '../../middlewares/autenticacaoMiddlewares.js';
import { autorizar } from '../../middlewares/autorizacaoMiddlewares.js';


const router = new Router();

const entregaRepo = new entregasRepository(prisma);
const motoristaRepo = new motoristasRepository(prisma);
const entregaService = new entregasService(entregaRepo, motoristaRepo);
const motoristaService = new motoristasService(motoristaRepo);
const painelEntregaCtlr = new painelEntregasController(entregaService, motoristaService);


router.get('/', (req, res, next) => painelEntregaCtlr.index(req, res, next));
router.get('/nova', (req, res, next) => painelEntregaCtlr.formularioVazio(req, res, next));
router.post('/', (req, res, next) => painelEntregaCtlr.nova(req, res, next));
router.get('/:id', (req, res, next) => painelEntregaCtlr.detalhe(req, res, next));
router.patch('/:id/avancar', (req, res, next) => painelEntregaCtlr.avancarStatus(req, res, next));
router.patch('/:id/cancelar', (req, res, next) => painelEntregaCtlr.cancelar(req, res, next));
router.patch('/:id/atribuiMotorista', (req, res, next) => painelEntregaCtlr.atribuiMotorista(req, res, next));

export default router;