import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { apiRouter } from './routes';
import { errorHandler } from './shared/middlewares/errorHandler';
import { tenantMiddleware } from './shared/middlewares/tenantMiddleware';

/** Monta a aplicação Express (sem subir o listener — facilita testes). */
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(tenantMiddleware);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'psiapp-backend', env: env.NODE_ENV });
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
}
