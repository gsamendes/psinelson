import type { Request, Response } from 'express';
import { auditService } from './service';
import { requireTenant } from '../../shared/http/context';

export const auditController = {
  async list(req: Request, res: Response) {
    res.json(await auditService.list(requireTenant(req)));
  },
};
