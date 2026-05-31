import { Router } from 'express';
import { therapeuticBondsController } from './controller';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const therapeuticBondsRoutes = Router();

therapeuticBondsRoutes.use(authMiddleware);
therapeuticBondsRoutes.get(
  '/',
  requireRole('ADMIN'),
  asyncHandler(therapeuticBondsController.list)
);
therapeuticBondsRoutes.get(
  '/psychologist/:psychologistId',
  requireRole('PSYCHOLOGIST', 'ADMIN'),
  asyncHandler(therapeuticBondsController.listByPsychologist)
);
