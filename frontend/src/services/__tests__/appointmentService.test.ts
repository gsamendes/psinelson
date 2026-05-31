import { describe, it, expect } from 'vitest';
import {
  acceptAppointment,
  cancelAppointment,
  createAppointmentRequest,
  rejectAppointment,
} from '../appointmentService';

describe('appointmentService (mock — fluxo de agendamento)', () => {
  it('nova solicitação nasce com status PENDENTE (nunca confirma automático)', async () => {
    const appt = await createAppointmentRequest({
      psychologist: {
        id: 'p9',
        name: 'Dra. Teste',
        avatar: '',
        specialty: 'Ansiedade',
        modality: 'online',
      },
      slot: { id: 's9', date: '2026-07-01', weekday: 'Qua', time: '10:00' },
    });
    expect(appt.status).toBe('PENDENTE');
  });

  it('aceitar uma solicitação muda o status para CONFIRMADA', async () => {
    const updated = await acceptAppointment('ap3');
    expect(updated.status).toBe('CONFIRMADA');
  });

  it('recusar uma solicitação muda o status para RECUSADA', async () => {
    const updated = await rejectAppointment('ap4');
    expect(updated.status).toBe('RECUSADA');
  });

  it('cancelar uma consulta criada muda o status para CANCELADA', async () => {
    const created = await createAppointmentRequest({
      psychologist: {
        id: 'p8',
        name: 'Dr. Cancelar',
        avatar: '',
        specialty: 'Estresse',
        modality: 'presencial',
      },
      slot: { id: 's8', date: '2026-07-02', weekday: 'Qui', time: '11:00' },
    });
    const canceled = await cancelAppointment(created.id);
    expect(canceled.status).toBe('CANCELADA');
  });

  it('não permite aceitar uma solicitação já decidida', async () => {
    await expect(acceptAppointment('ap3')).rejects.toThrow();
  });
});
