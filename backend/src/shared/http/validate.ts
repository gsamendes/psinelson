import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

/** Middleware que valida e tipa `req.body` contra um schema Zod. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new AppError(400, 'Erro de validação.', result.error.flatten()));
    }
    req.body = result.data;
    next();
  };
}
