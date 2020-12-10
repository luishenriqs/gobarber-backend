import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

// Essa interface é usada para forçar a tipagem do decoded (token decodificado).
interface TokenPayload {
  iat: number; // Quando o token foi gerado;
  exp: number; // Quando o token expira;
  sub: string; // Qual usuário gerou o token (user.id);
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
    throw new AppError('JWT token is missing', 401);
  }

  // O 'split' separa o authHeader em 2 partes (Type: Bearer/ Token)
  // O token tem o secret que será comparado pelo 'verify'.
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload; // Forçando a tipagem da variável.

    // Setando id do usuário como uma das informações da request da requisição.
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
