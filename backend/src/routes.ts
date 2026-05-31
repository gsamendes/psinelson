import { Router } from 'express';
import { authMiddleware } from './shared/middlewares/authMiddleware';
import { asyncHandler } from './shared/utils/asyncHandler';
import { schedulingController } from './modules/scheduling/controller';
import { authRoutes } from './modules/auth/routes';
import { usersRoutes } from './modules/users/routes';
import { patientsRoutes } from './modules/patients/routes';
import { psychologistsRoutes } from './modules/psychologists/routes';
import { tenantsRoutes } from './modules/tenants/routes';
import { schedulingRoutes } from './modules/scheduling/routes';
import { appointmentsRoutes } from './modules/appointments/routes';
import { therapeuticBondsRoutes } from './modules/therapeutic-bonds/routes';
import { medicalRecordsRoutes } from './modules/medical-records/routes';
import { messagesRoutes } from './modules/messages/routes';
import { notificationsRoutes } from './modules/notifications/routes';
import { auditRoutes } from './modules/audit/routes';

/** Agrupa todas as rotas dos módulos sob /api. */
export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', usersRoutes);
apiRouter.use('/patients', patientsRoutes);
apiRouter.use('/psychologists', psychologistsRoutes);
apiRouter.use('/tenants', tenantsRoutes);
apiRouter.use('/scheduling', schedulingRoutes);
// Alias compatível com o contrato: GET /availability/:psychologistId
apiRouter.get(
  '/availability/:psychologistId',
  authMiddleware,
  asyncHandler(schedulingController.listByPsychologist)
);
apiRouter.use('/appointments', appointmentsRoutes);
apiRouter.use('/therapeutic-bonds', therapeuticBondsRoutes);
apiRouter.use('/medical-records', medicalRecordsRoutes);
apiRouter.use('/messages', messagesRoutes);
apiRouter.use('/notifications', notificationsRoutes);
apiRouter.use('/audit', auditRoutes);
