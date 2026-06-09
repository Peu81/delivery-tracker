import { Router } from 'express';
import  apiEntregasRoutes from './api/entregas.routes.js'; 
import  apiMotoristasRoutes from './api/motoristas.routes.js'; 
import  apiUsuariosRoutes from './api/usuarios.routes.js';
import painelEntregasRoutes from './painel/entregas.routes.js';
import painelMotoristasRoutes from './painel/motoristas.routes.js'; 
import painelRoutes from './painel/painel.routes.js';

const routes = Router()

routes.use('/api/entregas', apiEntregasRoutes);
routes.use('/api/motoristas', apiMotoristasRoutes);
routes.use('/api/auth', apiUsuariosRoutes);

routes.use('/painel', painelRoutes);
routes.use('/painel/entregas', painelEntregasRoutes);
routes.use('/painel/motoristas', painelMotoristasRoutes);

export default routes;