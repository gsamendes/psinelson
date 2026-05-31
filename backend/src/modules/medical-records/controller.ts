import type { Request, Response } from 'express';
import { medicalRecordsService } from './service';

export const medicalRecordsController = {
  // Intencionalmente bloqueado nesta fase (lança 501 no service).
  async list(_req: Request, res: Response) {
    res.json(medicalRecordsService.list());
  },

  async get(_req: Request, res: Response) {
    res.json(medicalRecordsService.get());
  },
};
