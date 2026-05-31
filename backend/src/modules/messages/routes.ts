import { Router } from 'express';
import { messagesController } from './controller';
import { sendMessageSchema } from './schemas';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';
import { validateBody } from '../../shared/http/validate';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const messagesRoutes = Router();

messagesRoutes.use(authMiddleware);
// Contrato: GET /messages (caixa do usuário) e POST /messages (enviar).
messagesRoutes.get('/', asyncHandler(messagesController.listMine));
messagesRoutes.get('/me', asyncHandler(messagesController.listMine));
messagesRoutes.post('/', validateBody(sendMessageSchema), asyncHandler(messagesController.create));
