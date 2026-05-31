import type { NextFunction, Request, Response } from 'express';

/**
 * Multi-tenancy stateless (esqueleto). O tenant vem preferencialmente do JWT
 * (definido no authMiddleware). Para rotas públicas, aceita o header
 * `x-tenant-id` como fallback. A aplicação disciplinada do `tenantId` nas
 * queries (ADR-001) é responsabilidade de cada service.
 */
export function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (!req.tenantId) {
    const headerTenant = req.header('x-tenant-id');
    if (headerTenant) {
      req.tenantId = headerTenant;
    }
  }
  next();
}
