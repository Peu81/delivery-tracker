import jwt from 'jsonwebtoken';

const SECRET         = process.env.JWT_SECRET;
const EXPIRES_IN     = process.env.JWT_EXPIRES_IN;


export function gerarAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verificarAccessToken(token) {
  return jwt.verify(token, SECRET); 
}
