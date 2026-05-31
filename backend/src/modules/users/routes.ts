import { Router } from 'express';
import { usersController } from './controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const usersRoutes = Router();

usersRoutes.use(authMiddleware);
usersRoutes.get('/', asyncHandler(usersController.list));
usersRoutes.get('/me', asyncHandler(usersController.me));
usersRoutes.get('/:id', asyncHandler(usersController.getById));
