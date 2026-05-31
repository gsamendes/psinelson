import { prisma } from '../../shared/prisma/prismaClient';
import { AppError } from '../../shared/errors/AppError';

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  tenantId: true,
  createdAt: true,
} as const;

/** Operações básicas de usuário, sempre escopadas por tenant. */
export const usersService = {
  list(tenantId: string) {
    return prisma.user.findMany({ where: { tenantId }, select: publicSelect });
  },

  async getById(tenantId: string, id: string) {
    const user = await prisma.user.findFirst({
      where: { id, tenantId },
      select: publicSelect,
    });
    if (!user) throw new AppError(404, 'Usuário não encontrado.');
    return user;
  },

  async me(tenantId: string, userId: string) {
    return this.getById(tenantId, userId);
  },
};
