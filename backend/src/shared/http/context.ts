import type { Request } from 'express';
import { AppError } from '../errors/AppError';

/** Garante e retorna o tenantId do request (definido por auth/tenant middleware). */
export function requireTenant(req: Request): string {
  if (!req.tenantId) {
    throw new AppError(400, 'Tenant não identificado (JWT ou header x-tenant-id).');
  }
  return req.tenantId;
}

/** Garante e retorna o ID do usuário autenticado. */
export function requireUserId(req: Request): string {
  if (!req.user?.sub) {
    throw new AppError(401, 'Não autenticado.');
  }
  return req.user.sub;
}
