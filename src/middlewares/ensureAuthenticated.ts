import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/* Essa function verifica se o Header da requisição possúi a chave secreta
(dentro da authorization) fornecida na autenticação. Em caso afirmativo ela
permite a execução da requisição com a chamada next(), em caso contrário
dispara a mensagem de erro. */

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  // O 'split' separa o authHeader em 2 partes, a segunda foi chamada de token.
  // O token tem o secret que será comparado pelo 'verify'.
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
}
