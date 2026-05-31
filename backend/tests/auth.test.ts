import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Auth — validação Zod (sem banco)', () => {
  it('POST /api/auth/register com body vazio retorna 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/auth/register com e-mail inválido retorna 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ tenantId: 't1', name: 'Ana', email: 'nao-eh-email', password: '123456' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login com body inválido retorna 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'x' });
    expect(res.status).toBe(400);
  });

  it('GET /api/auth/me sem token retorna 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
