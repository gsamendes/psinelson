import { Router } from 'express';
import { auditController } from './controller';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const auditRoutes = Router();

auditRoutes.use(authMiddleware);
auditRoutes.get('/', requireRole('ADMIN'), asyncHandler(auditController.list));
