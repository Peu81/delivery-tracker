import { Router } from "express";
import { prisma } from "../../config/dbInit.js";
import { motoristasRepository } from "../../repositories/motoristasRepository.js";
import { entregasRepository } from "../../repositories/entregasRepository.js";
import { motoristasService } from "../../services/motoristasService.js";
import { entregasService } from "../../services/entregasService.js";
import { motoristasController as painelMotoristasController } from "../../controllers/painel/motoristasController.js";


const router = new Router();

const motoristaRepo = new motoristasRepository(prisma);
const motoristaService = new motoristasService(motoristaRepo);
const entregaRepo = new entregasRepository(prisma);
const entregaService = new entregasService(entregaRepo, motoristaRepo);
const painelMotoristaCtlr = new painelMotoristasController(motoristaService, entregaService);


router.get('/', (req, res, next) => painelMotoristaCtlr.index(req, res, next));
router.get('/novo', (req, res, next) => painelMotoristaCtlr.formularioVazio(req, res, next));
router.post('/', (req, res, next) => painelMotoristaCtlr.novo(req, res, next));
router.get('/:id/entregas', (req, res, next) => painelMotoristaCtlr.listarEntregas(req, res, next));

export default router;