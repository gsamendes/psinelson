import { Router } from 'express';
import { tenantsController } from './controller';
import { createTenantSchema } from './schemas';
import { validateBody } from '../../shared/http/validate';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const tenantsRoutes = Router();

// Rotas de bootstrap (sem auth nesta fase de esqueleto — restringir depois).
tenantsRoutes.get('/', asyncHandler(tenantsController.list));
tenantsRoutes.post('/', validateBody(createTenantSchema), asyncHandler(tenantsController.create));
