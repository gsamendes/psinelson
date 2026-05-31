import type { Request, Response } from 'express';
import { therapeuticBondsService } from './service';
import { requireTenant } from '../../shared/http/context';

export const therapeuticBondsController = {
  async list(req: Request, res: Response) {
    res.json(await therapeuticBondsService.list(requireTenant(req)));
  },

  async listByPsychologist(req: Request, res: Response) {
    res.json(
      await therapeuticBondsService.listByPsychologist(
        requireTenant(req),
        req.params.psychologistId
      )
    );
  },
};
