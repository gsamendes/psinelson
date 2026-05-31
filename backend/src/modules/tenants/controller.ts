import type { Request, Response } from 'express';
import { tenantsService } from './service';

export const tenantsController = {
  async list(_req: Request, res: Response) {
    res.json(await tenantsService.list());
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await tenantsService.create(req.body));
  },
};
