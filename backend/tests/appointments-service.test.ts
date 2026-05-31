import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/shared/prisma/prismaClient', () => ({
  prisma: {
    appointment: { findFirst: vi.fn(), update: vi.fn() },
  },
}));

import { prisma } from '../src/shared/prisma/prismaClient';
import { appointmentsService } from '../src/modules/appointments/service';

const findFirst = vi.mocked(prisma.appointment.findFirst);
const update = vi.mocked(prisma.appointment.update);

beforeEach(() => {
  findFirst.mockReset();
  update.mockReset();
});

describe('appointmentsService.cancel (prisma mockado)', () => {
  it('cancela uma consulta PENDENTE → CANCELADA', async () => {
    findFirst.mockResolvedValue({ id: 'a1', tenantId: 't1', status: 'PENDENTE' } as never);
    update.mockResolvedValue({ id: 'a1', status: 'CANCELADA' } as never);

    const res = await appointmentsService.cancel('t1', 'a1');
    expect(res.status).toBe('CANCELADA');
    expect(update).toHaveBeenCalledWith({ where: { id: 'a1' }, data: { status: 'CANCELADA' } });
  });

  it('rejeita cancelar consulta já realizada (409)', async () => {
    findFirst.mockResolvedValue({ id: 'a1', tenantId: 't1', status: 'REALIZADA' } as never);
    await expect(appointmentsService.cancel('t1', 'a1')).rejects.toMatchObject({ statusCode: 409 });
  });

  it('rejeita consulta inexistente (404)', async () => {
    findFirst.mockResolvedValue(null as never);
    await expect(appointmentsService.cancel('t1', 'zzz')).rejects.toMatchObject({ statusCode: 404 });
  });
});
