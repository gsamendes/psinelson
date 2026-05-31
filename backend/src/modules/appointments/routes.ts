import { Router } from 'express';
import { appointmentsController } from './controller';
import { createAppointmentSchema } from './schemas';
import { authMiddleware, requireRole } from '../../shared/middlewares/authMiddleware';
import { validateBody } from '../../shared/http/validate';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const appointmentsRoutes = Router();

appointmentsRoutes.use(authMiddleware);

appointmentsRoutes.get('/me', asyncHandler(appointmentsController.listMine));
appointmentsRoutes.get(
  '/psychologist/:psychologistId',
  asyncHandler(appointmentsController.listByPsychologist)
);
appointmentsRoutes.get(
  '/patient/:patientId',
  asyncHandler(appointmentsController.listByPatient)
);
appointmentsRoutes.post(
  '/',
  validateBody(createAppointmentSchema),
  asyncHandler(appointmentsController.create)
);
appointmentsRoutes.patch(
  '/:id/accept',
  requireRole('PSYCHOLOGIST', 'ADMIN'),
  asyncHandler(appointmentsController.accept)
);
appointmentsRoutes.patch(
  '/:id/reject',
  requireRole('PSYCHOLOGIST', 'ADMIN'),
  asyncHandler(appointmentsController.reject)
);
appointmentsRoutes.patch('/:id/cancel', asyncHandler(appointmentsController.cancel));
