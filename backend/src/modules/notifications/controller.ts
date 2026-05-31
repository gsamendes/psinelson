import type { Request, Response } from 'express';
import { notificationsService } from './service';
import { requireTenant, requireUserId } from '../../shared/http/context';

export const notificationsController = {
  async listMine(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.json(await notificationsService.listForUser(tenantId, userId));
  },

  async markAllRead(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    res.json(await notificationsService.markAllRead(tenantId, userId));
  },
};
