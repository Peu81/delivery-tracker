import { AppError } from '../utils/AppError.js';

export const autorizar = (...papeisPermitidos) => (req, res, next) => {
  if (!req.usuario) {
    return next(new AppError('Não autenticado', 401));
  }

  if (!papeisPermitidos.includes(req.usuario.papel)) {
    return next(new AppError(`Acesso negado.`, 403));
  }

  next();
};