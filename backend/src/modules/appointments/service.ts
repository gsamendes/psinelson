import { prisma } from '../../shared/prisma/prismaClient';
import { AppError } from '../../shared/errors/AppError';
import type { CreateAppointmentInput } from './schemas';

/**
 * Agendamentos (esqueleto). Fluxo: solicitação PENDENTE → análise do
 * psicólogo → CONFIRMADA/RECUSADA. Nunca confirma automaticamente.
 */
export const appointmentsService = {
  listByPsychologist(tenantId: string, psychologistId: string) {
    return prisma.appointment.findMany({
      where: { tenantId, psychologistId },
      orderBy: { createdAt: 'desc' },
    });
  },

  listByPatient(tenantId: string, patientId: string) {
    return prisma.appointment.findMany({
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /** Lista as consultas do usuário logado conforme o papel (paciente/psicólogo). */
  async listForUser(tenantId: string, userId: string, role: string) {
    if (role === 'PSYCHOLOGIST') {
      const profile = await prisma.psychologistProfile.findFirst({
        where: { userId, tenantId },
        select: { id: true },
      });
      return profile ? this.listByPsychologist(tenantId, profile.id) : [];
    }
    const profile = await prisma.patientProfile.findFirst({
      where: { userId, tenantId },
      select: { id: true },
    });
    return profile ? this.listByPatient(tenantId, profile.id) : [];
  },

  async createRequest(tenantId: string, input: CreateAppointmentInput) {
    const availability = await prisma.availability.findFirst({
      where: { id: input.availabilityId, tenantId },
    });
    if (!availability) throw new AppError(404, 'Horário indisponível.');
    if (availability.isBooked) throw new AppError(409, 'Horário já reservado.');

    return prisma.appointment.create({
      data: {
        tenantId,
        patientId: input.patientId,
        psychologistId: input.psychologistId,
        availabilityId: input.availabilityId,
        scheduledAt: availability.date,
        notes: input.notes,
        status: 'PENDENTE',
      },
    });
  },

  async accept(tenantId: string, id: string) {
    const appointment = await prisma.appointment.findFirst({ where: { id, tenantId } });
    if (!appointment) throw new AppError(404, 'Agendamento não encontrado.');
    if (appointment.status !== 'PENDENTE') {
      throw new AppError(409, 'Somente solicitações pendentes podem ser aceitas.');
    }

    // Confirma e marca o horário como reservado (um horário, um paciente).
    const [updated] = await prisma.$transaction([
      prisma.appointment.update({ where: { id }, data: { status: 'CONFIRMADA' } }),
      ...(appointment.availabilityId
        ? [
            prisma.availability.update({
              where: { id: appointment.availabilityId },
              data: { isBooked: true },
            }),
          ]
        : []),
    ]);
    return updated;
  },

  async reject(tenantId: string, id: string) {
    const appointment = await prisma.appointment.findFirst({ where: { id, tenantId } });
    if (!appointment) throw new AppError(404, 'Agendamento não encontrado.');
    if (appointment.status !== 'PENDENTE') {
      throw new AppError(409, 'Somente solicitações pendentes podem ser recusadas.');
    }
    return prisma.appointment.update({ where: { id }, data: { status: 'RECUSADA' } });
  },

  async cancel(tenantId: string, id: string) {
    const appointment = await prisma.appointment.findFirst({ where: { id, tenantId } });
    if (!appointment) throw new AppError(404, 'Agendamento não encontrado.');
    if (appointment.status !== 'PENDENTE' && appointment.status !== 'CONFIRMADA') {
      throw new AppError(409, 'Esta consulta não pode ser cancelada.');
    }
    return prisma.appointment.update({ where: { id }, data: { status: 'CANCELADA' } });
  },
};
