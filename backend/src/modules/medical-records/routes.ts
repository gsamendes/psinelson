import { Router } from 'express';
import { medicalRecordsController } from './controller';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const medicalRecordsRoutes = Router();

// Bloqueado nesta fase: somente psicólogo/admin e, ainda assim, retorna 501.
medicalRecordsRoutes.use(authMiddleware);
medicalRecordsRoutes.get('/', requireRole('PSYCHOLOGIST', 'ADMIN'), asyncHandler(medicalRecordsController.list));
medicalRecordsRoutes.get('/:id', requireRole('PSYCHOLOGIST', 'ADMIN'), asyncHandler(medicalRecordsController.get));
