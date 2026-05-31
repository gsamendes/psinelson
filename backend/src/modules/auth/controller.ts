import type { Request, Response } from 'express';
import { authService } from './service';
import { requireTenant, requireUserId } from '../../shared/http/context';

export const authController = {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json(result);
  },

  async refresh(req: Request, res: Response) {
    res.json(authService.refresh(req.body.refreshToken));
  },

  async me(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.json(await authService.me(tenantId, userId));
  },
};
