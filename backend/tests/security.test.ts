import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

/**
 * Garantias de segurança das rotas protegidas (authMiddleware) — todas devem
 * rejeitar requisição sem token, antes de qualquer acesso a banco.
 */
describe('Rotas protegidas exigem token (401 sem Authorization)', () => {
  const protectedRoutes: Array<[string, 'get' | 'patch']> = [
    ['/api/psychologists', 'get'],
    ['/api/psychologists/p1', 'get'],
    ['/api/availability/p1', 'get'],
    ['/api/appointments/me', 'get'],
    ['/api/appointments/abc/accept', 'patch'],
    ['/api/appointments/abc/reject', 'patch'],
    ['/api/appointments/abc/cancel', 'patch'],
    ['/api/notifications/me', 'get'],
    ['/api/medical-records', 'get'],
  ];

  it.each(protectedRoutes)('%s (%s) sem token → 401', async (path, method) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
  });
});

describe('Appointments — validação de payload', () => {
  it('POST /api/appointments sem token → 401 (auth antes da validação)', async () => {
    const res = await request(app).post('/api/appointments').send({});
    expect(res.status).toBe(401);
  });
});
