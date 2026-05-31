import { z } from 'zod';

/** Cadastro de disponibilidade (horário ofertado pelo psicólogo). */
export const createAvailabilitySchema = z.object({
  psychologistId: z.string().min(1),
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Formato esperado HH:mm'),
  modality: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('ONLINE'),
});

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
