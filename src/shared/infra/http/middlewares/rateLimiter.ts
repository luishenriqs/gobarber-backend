import { Request, Response, NextFunction } from "express";
import redis from 'redis';
import AppError from '@shared/errors/AppError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

/* limiter: Determina o limite máximo de requisições feitas por um mesmo IP; */
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5, // 5 requests
  duration: 1, // per 1 second by IP
});

/* MIDDLEWARE QUE COMBATE OS ATAQUES DE 'BRUTE FORCE'; */
export default async function rateLimiter (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Se o consumo estiver dentro do limite chama o 'next';
    await limiter.consume(request.ip);
    return next();
    // Se o consumo extrapolar o limite dispara 'AppError';
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
