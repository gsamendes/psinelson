import { prisma } from '../../shared/prisma/prismaClient';

/** Notificações internas do usuário, escopadas por tenant. */
export const notificationsService = {
  listForUser(tenantId: string, userId: string) {
    return prisma.notification.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async markAllRead(tenantId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { tenantId, userId, read: false },
      data: { read: true },
    });
    return { ok: true };
  },
};
