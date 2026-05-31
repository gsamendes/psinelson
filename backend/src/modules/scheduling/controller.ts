import type { Request, Response } from 'express';
import { schedulingService } from './service';
import { requireTenant } from '../../shared/http/context';

export const schedulingController = {
  async listByPsychologist(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await schedulingService.listByPsychologist(tenantId, req.params.psychologistId));
  },

  async create(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.status(201).json(await schedulingService.create(tenantId, req.body));
  },

  async remove(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await schedulingService.remove(tenantId, req.params.id));
  },
};
