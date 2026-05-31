import { prisma } from '../../shared/prisma/prismaClient';
import type { SendMessageInput } from './schemas';

/** Mensagens administrativas (sem tempo real nesta fase). Escopadas por tenant. */
export const messagesService = {
  listForUser(tenantId: string, userId: string) {
    return prisma.message.findMany({
      where: { tenantId, recipientId: userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(tenantId: string, senderId: string, input: SendMessageInput) {
    return prisma.message.create({
      data: {
        tenantId,
        senderId,
        recipientId: input.recipientId,
        subject: input.subject,
        body: input.body,
      },
    });
  },
};
