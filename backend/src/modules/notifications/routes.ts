import { Router } from 'express';
import { notificationsController } from './controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const notificationsRoutes = Router();

notificationsRoutes.use(authMiddleware);
notificationsRoutes.get('/me', asyncHandler(notificationsController.listMine));
notificationsRoutes.patch('/me/read-all', asyncHandler(notificationsController.markAllRead));
