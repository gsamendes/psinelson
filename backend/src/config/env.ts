import 'dotenv/config';
import { z } from 'zod';

/**
 * Validação centralizada das variáveis de ambiente.
 * DATABASE_URL é opcional para permitir build/boot sem banco nesta fase de
 * esqueleto — as queries Prisma falharão em runtime se não houver conexão.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(1).default('troque-este-segredo-em-producao'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
