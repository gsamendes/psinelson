import type { Request, Response } from 'express';
import { messagesService } from './service';
import { requireTenant, requireUserId } from '../../shared/http/context';

export const messagesController = {
  async listMine(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.json(await messagesService.listForUser(tenantId, userId));
  },

  async create(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.status(201).json(await messagesService.create(tenantId, userId, req.body));
  },
};
