import { prisma } from '../../shared/prisma/prismaClient';
import type { CreateAvailabilityInput } from './schemas';

/** Disponibilidade do psicólogo, escopada por tenant. */
export const schedulingService = {
  listByPsychologist(tenantId: string, psychologistId: string) {
    return prisma.availability.findMany({
      where: { tenantId, psychologistId },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  },

  create(tenantId: string, input: CreateAvailabilityInput) {
    return prisma.availability.create({
      data: {
        tenantId,
        psychologistId: input.psychologistId,
        date: input.date,
        time: input.time,
        modality: input.modality,
      },
    });
  },

  async remove(tenantId: string, id: string) {
    await prisma.availability.deleteMany({ where: { id, tenantId } });
    return { id };
  },
};
