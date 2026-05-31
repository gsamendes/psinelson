import { z } from 'zod';

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  subject: z.string().max(140).optional(),
  body: z.string().min(1).max(2000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
