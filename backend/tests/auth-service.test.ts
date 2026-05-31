import { describe, it, expect, vi, beforeEach } from 'vitest';

// Prisma mockado — testes de integração do service sem banco real.
vi.mock('../src/shared/prisma/prismaClient', () => ({
  prisma: {
    user: { findFirst: vi.fn(), create: vi.fn() },
  },
}));

import { prisma } from '../src/shared/prisma/prismaClient';
import { authService } from '../src/modules/auth/service';
import { hashPassword } from '../src/shared/utils/password';
import { signRefreshToken } from '../src/shared/utils/jwt';

const findFirst = vi.mocked(prisma.user.findFirst);
const create = vi.mocked(prisma.user.create);

beforeEach(() => {
  findFirst.mockReset();
  create.mockReset();
});

describe('authService.register (prisma mockado)', () => {
  it('cria usuário com senha em HASH (nunca texto puro)', async () => {
    findFirst.mockResolvedValue(null as never);
    create.mockResolvedValue({
      id: 'u1',
      name: 'Ana',
      email: 'ana@ex.com',
      role: 'PSYCHOLOGIST',
      tenantId: 't1',
    } as never);

    const result = await authService.register({
      tenantId: 't1',
      name: 'Ana',
      email: 'ana@ex.com',
      password: '123456',
      role: 'PSYCHOLOGIST',
    });

    expect(result.email).toBe('ana@ex.com');
    const dataArg = create.mock.calls[0][0].data as { passwordHash: string };
    expect(dataArg.passwordHash).not.toBe('123456');
    expect(dataArg.passwordHash.startsWith('$2')).toBe(true); // hash bcrypt
  });

  it('rejeita e-mail já cadastrado no tenant (409)', async () => {
    findFirst.mockResolvedValue({ id: 'existing' } as never);
    await expect(
      authService.register({
        tenantId: 't1',
        name: 'Ana',
        email: 'ana@ex.com',
        password: '123456',
        role: 'PATIENT',
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

describe('authService.login (prisma mockado)', () => {
  it('autentica com senha correta e devolve tokens', async () => {
    const passwordHash = await hashPassword('123456');
    findFirst.mockResolvedValue({
      id: 'u1',
      name: 'Ana',
      email: 'ana@ex.com',
      role: 'PATIENT',
      tenantId: 't1',
      passwordHash,
    } as never);

    const res = await authService.login({ email: 'ana@ex.com', password: '123456' });
    expect(res.user.email).toBe('ana@ex.com');
    expect(res.accessToken).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
  });

  it('rejeita senha incorreta (401)', async () => {
    const passwordHash = await hashPassword('123456');
    findFirst.mockResolvedValue({
      id: 'u1',
      name: 'Ana',
      email: 'ana@ex.com',
      role: 'PATIENT',
      tenantId: 't1',
      passwordHash,
    } as never);

    await expect(
      authService.login({ email: 'ana@ex.com', password: 'errada' })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('rejeita usuário inexistente (401)', async () => {
    findFirst.mockResolvedValue(null as never);
    await expect(
      authService.login({ email: 'nao@existe.com', password: '123456' })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe('authService.refresh', () => {
  it('renova tokens a partir de um refresh token válido', () => {
    const token = signRefreshToken({ sub: 'u1', role: 'PATIENT', tenantId: 't1' });
    const res = authService.refresh(token);
    expect(res.accessToken).toBeTruthy();
    expect(res.refreshToken).toBeTruthy();
  });

  it('rejeita refresh token inválido (401)', () => {
    expect(() => authService.refresh('token.invalido')).toThrowError(/inválido|expirado/i);
  });
});
