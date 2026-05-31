import type { JwtPayload } from '../utils/jwt';

// Estende o Request do Express com dados derivados do JWT/tenant.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      tenantId?: string;
    }
  }
}

export {};
