import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'slug deve conter apenas minúsculas, números e hífen'),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
