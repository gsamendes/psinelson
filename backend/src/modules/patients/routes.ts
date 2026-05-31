import { Router } from 'express';
import { patientsController } from './controller';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const patientsRoutes = Router();

patientsRoutes.use(authMiddleware);
// Listagem de pacientes restrita a psicólogos/admin (RBAC — esqueleto).
patientsRoutes.get('/', requireRole('PSYCHOLOGIST', 'ADMIN'), asyncHandler(patientsController.list));
patientsRoutes.get('/:id', requireRole('PSYCHOLOGIST', 'ADMIN'), asyncHandler(patientsController.getById));
