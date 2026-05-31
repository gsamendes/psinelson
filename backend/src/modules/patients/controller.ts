import type { Request, Response } from 'express';
import { patientsService } from './service';
import { requireTenant } from '../../shared/http/context';

export const patientsController = {
  async list(req: Request, res: Response) {
    res.json(await patientsService.list(requireTenant(req)));
  },

  async getById(req: Request, res: Response) {
    res.json(await patientsService.getById(requireTenant(req), req.params.id));
  },
};
