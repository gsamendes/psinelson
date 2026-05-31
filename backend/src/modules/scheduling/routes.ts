import { Router } from 'express';
import { schedulingController } from './controller';
import { createAvailabilitySchema } from './schemas';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { validateBody } from '../../shared/http/validate';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const schedulingRoutes = Router();

schedulingRoutes.use(authMiddleware);
schedulingRoutes.get(
  '/psychologist/:psychologistId',
  asyncHandler(schedulingController.listByPsychologist)
);
schedulingRoutes.post(
  '/',
  requireRole('PSYCHOLOGIST', 'ADMIN'),
  validateBody(createAvailabilitySchema),
  asyncHandler(schedulingController.create)
);
schedulingRoutes.delete(
  '/:id',
  requireRole('PSYCHOLOGIST', 'ADMIN'),
  asyncHandler(schedulingController.remove)
);
