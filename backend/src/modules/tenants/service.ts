import { prisma } from '../../shared/prisma/prismaClient';
import { AppError } from '../../shared/errors/AppError';

/** Gestão de tenants (organizações). Isolamento lógico via tenantId (ADR-001). */
export const tenantsService = {
  list() {
    return prisma.tenant.findMany({ select: { id: true, name: true, slug: true, createdAt: true } });
  },

  async create(input: { name: string; slug: string }) {
    const exists = await prisma.tenant.findUnique({ where: { slug: input.slug } });
    if (exists) throw new AppError(409, 'Slug de tenant já existe.');
    return prisma.tenant.create({ data: input });
  },
};
