import type { Request, Response } from 'express';
import { usersService } from './service';
import { requireTenant, requireUserId } from '../../shared/http/context';

export const usersController = {
  async list(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await usersService.list(tenantId));
  },

  async me(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.json(await usersService.me(tenantId, userId));
  },

  async getById(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await usersService.getById(tenantId, req.params.id));
  },
};
