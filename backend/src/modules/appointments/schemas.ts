import { z } from 'zod';

/** Solicitação de agendamento. Nasce sempre PENDENTE (regra de negócio). */
export const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  psychologistId: z.string().min(1),
  availabilityId: z.string().min(1),
  notes: z.string().max(500).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
