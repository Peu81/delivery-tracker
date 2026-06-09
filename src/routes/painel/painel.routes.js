import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {res.render('index', {titulo: 'Painel Principal'});});
router.get('/login', (req, res) => {res.render('usuarios/login', { titulo: 'Login' });});
router.get('/registrar', (req, res) => {res.render('usuarios/novo', { titulo: 'Registrar', usuario: {} });})


export default router;