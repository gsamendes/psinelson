import { prisma } from '../../shared/prisma/prismaClient';

/** Vínculos terapêuticos paciente↔psicólogo, escopados por tenant. */
export const therapeuticBondsService = {
  list(tenantId: string) {
    return prisma.therapeuticBond.findMany({ where: { tenantId } });
  },

  listByPsychologist(tenantId: string, psychologistId: string) {
    return prisma.therapeuticBond.findMany({ where: { tenantId, psychologistId } });
  },
};
