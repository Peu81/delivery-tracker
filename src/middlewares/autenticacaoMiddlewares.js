import { verificarAccessToken } from '../utils/jwt.js';
import { AppError }             from '../utils/AppError.js';

export const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token não fornecido', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload  = verificarAccessToken(token);
    req.usuario    = payload;
    console.log("DADOS DO TOKEN:", req.usuario);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    next(err);
  }
};