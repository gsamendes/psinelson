import type { Request, Response } from 'express';
import { psychologistsService } from './service';
import { requireTenant } from '../../shared/http/context';

export const psychologistsController = {
  async list(req: Request, res: Response) {
    res.json(await psychologistsService.list(requireTenant(req)));
  },

  async getById(req: Request, res: Response) {
    res.json(await psychologistsService.getById(requireTenant(req), req.params.id));
  },
};
