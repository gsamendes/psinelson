import { Router } from 'express';
import { psychologistsController } from './controller';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const psychologistsRoutes = Router();

psychologistsRoutes.use(authMiddleware);
psychologistsRoutes.get('/', asyncHandler(psychologistsController.list));
psychologistsRoutes.get('/:id', asyncHandler(psychologistsController.getById));
