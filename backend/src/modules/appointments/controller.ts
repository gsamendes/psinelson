import type { Request, Response } from 'express';
import { appointmentsService } from './service';
import { requireTenant, requireUserId } from '../../shared/http/context';
import { AppError } from '../../shared/errors/AppError';

export const appointmentsController = {
  async listMine(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    const userId = requireUserId(req);
    if (!req.user) throw new AppError(401, 'Não autenticado.');
    res.json(await appointmentsService.listForUser(tenantId, userId, req.user.role));
  },

  async cancel(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await appointmentsService.cancel(tenantId, req.params.id));
  },

  async listByPsychologist(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await appointmentsService.listByPsychologist(tenantId, req.params.psychologistId));
  },

  async listByPatient(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await appointmentsService.listByPatient(tenantId, req.params.patientId));
  },

  async create(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.status(201).json(await appointmentsService.createRequest(tenantId, req.body));
  },

  async accept(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await appointmentsService.accept(tenantId, req.params.id));
  },

  async reject(req: Request, res: Response) {
    const tenantId = requireTenant(req);
    res.json(await appointmentsService.reject(tenantId, req.params.id));
  },
};
