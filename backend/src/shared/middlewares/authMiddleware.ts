import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';
import { verifyToken } from '../utils/jwt';

/**
 * Exige um Bearer token válido. Popula `req.user` e `req.tenantId` a partir do
 * JWT (stateless — sem sessão em servidor).
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'Token de autenticação ausente ou inválido.');
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch {
    throw new AppError(401, 'Token inválido ou expirado.');
  }
}

/** Restringe o acesso a determinados papéis (RBAC). Usar após authMiddleware. */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Não autenticado.');
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Acesso negado para o seu perfil.');
    }
    next();
  };
}
