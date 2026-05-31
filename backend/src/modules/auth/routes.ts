import { Router } from 'express';
import { authController } from './controller';
import { loginSchema, refreshSchema, registerSchema } from './schemas';
import { validateBody } from '../../shared/http/validate';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema), asyncHandler(authController.register));
authRoutes.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
authRoutes.post('/refresh', validateBody(refreshSchema), asyncHandler(authController.refresh));
authRoutes.get('/me', authMiddleware, asyncHandler(authController.me));
