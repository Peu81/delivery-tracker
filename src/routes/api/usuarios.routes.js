import { Router } from "express";
import { prisma } from "../../config/dbInit.js";
import { usuariosRepository } from "../../repositories/usuariosRepository.js";
import { usuariosService } from "../../services/usuariosService.js";
import { usuariosController as apiUsuariosController } from "../../controllers/api/usuariosController.js";

const router = new Router();

const usuariosRepo = new usuariosRepository(prisma);
const usuarioService = new usuariosService(usuariosRepo);
const apiUsuarioCtlr = new apiUsuariosController(usuarioService); 

router.post('/registrar', (req, res, next) => apiUsuarioCtlr.criar(req, res, next));
router.post('/login', (req, res, next) => apiUsuarioCtlr.login(req, res, next));

export default router;