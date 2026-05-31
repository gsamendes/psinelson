import type { AppointmentStatus, PatientAppointment, Psychologist } from '../types';
import { currentPatient } from '../mocks/data';
import { ApiError, delay } from './http';
import { pushNotification } from './notificationService';
import { USE_MOCKS } from '../config/runtime';
import { apiRequest } from './apiClient';

/**
 * Service de consultas do paciente. Mantém um "banco" em memória (array no
 * módulo) que simula persistência durante a sessão. Trocar por chamadas HTTP
 * reais no 8º período (GET/POST/PATCH /appointments) sem alterar as telas.
 */

let nextId = 100;

const ANA_AVATAR =
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces';

/**
 * Estado inicial (demo) cobrindo todos os status do fluxo. As consultas com
 * a Dra. Ana Costa ('p1') alimentam tanto "Minhas Consultas" (paciente) quanto
 * "Solicitações"/"Agenda" (psicólogo logado) — mesma fonte de verdade, então
 * aceite/recusa pelo psicólogo reflete na visão do paciente.
 */
const db: PatientAppointment[] = [
  {
    id: 'ap1',
    psychologistId: 'p1',
    psychologistName: 'Dra. Ana Costa',
    psychologistAvatar: ANA_AVATAR,
    patientName: 'Camila Souza',
    patientAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces',
    specialty: 'Ansiedade',
    modality: 'online',
    date: '2026-05-20',
    weekday: 'Qua',
    time: '15:00',
    status: 'REALIZADA',
    createdAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'ap2',
    psychologistId: 'p3',
    psychologistName: 'Dra. Carla Menezes',
    psychologistAvatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
    patientName: 'Camila Souza',
    patientAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces',
    specialty: 'Relacionamentos',
    modality: 'presencial',
    date: '2026-06-03',
    weekday: 'Qua',
    time: '16:00',
    status: 'CONFIRMADA',
    createdAt: '2026-05-25T09:30:00.000Z',
  },
  {
    id: 'ap3',
    psychologistId: 'p1',
    psychologistName: 'Dra. Ana Costa',
    psychologistAvatar: ANA_AVATAR,
    patientName: 'Rafael Lima',
    patientAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
    specialty: 'Estresse',
    modality: 'online',
    date: '2026-06-02',
    weekday: 'Ter',
    time: '10:00',
    status: 'PENDENTE',
    createdAt: '2026-05-29T11:45:00.000Z',
  },
  {
    id: 'ap4',
    psychologistId: 'p1',
    psychologistName: 'Dra. Ana Costa',
    psychologistAvatar: ANA_AVATAR,
    patientName: 'Beatriz Nunes',
    patientAvatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=160&h=160&fit=crop&crop=faces',
    specialty: 'Autoestima',
    modality: 'presencial',
    date: '2026-06-03',
    weekday: 'Qua',
    time: '09:00',
    status: 'PENDENTE',
    createdAt: '2026-05-30T08:20:00.000Z',
  },
  {
    id: 'ap5',
    psychologistId: 'p1',
    psychologistName: 'Dra. Ana Costa',
    psychologistAvatar: ANA_AVATAR,
    patientName: 'Camila Souza',
    patientAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces',
    specialty: 'Ansiedade',
    modality: 'online',
    date: '2026-06-05',
    weekday: 'Sex',
    time: '17:00',
    status: 'CONFIRMADA',
    createdAt: '2026-05-27T16:10:00.000Z',
  },
];

/** Id do psicólogo autenticado nesta sessão (mock). */
const CURRENT_PSYCHOLOGIST_ID = 'p1';

export interface CreateAppointmentInput {
  psychologist: Pick<
    Psychologist,
    'id' | 'name' | 'avatar' | 'specialty' | 'modality'
  >;
  slot: { id: string; date: string; weekday: string; time: string };
}

export async function listAppointments(): Promise<PatientAppointment[]> {
  if (!USE_MOCKS) return apiRequest<PatientAppointment[]>('/appointments/me');
  // cópia para o consumidor não mutar o "banco" direto
  return delay(db.map((a) => ({ ...a })));
}

/**
 * Cria a solicitação. REGRA: nasce sempre 'PENDENTE' — nunca confirma
 * automaticamente. O aceite é do psicólogo (etapa futura).
 */
export async function createAppointmentRequest(
  input: CreateAppointmentInput
): Promise<PatientAppointment> {
  if (!USE_MOCKS) {
    return apiRequest<PatientAppointment>('/appointments', {
      method: 'POST',
      body: { psychologistId: input.psychologist.id, availabilityId: input.slot.id },
    });
  }
  const duplicate = db.some(
    (a) =>
      a.psychologistId === input.psychologist.id &&
      a.date === input.slot.date &&
      a.time === input.slot.time &&
      ['PENDENTE', 'CONFIRMADA'].includes(a.status)
  );
  if (duplicate) {
    return delay(null as never).then(() => {
      throw new ApiError('Você já tem uma solicitação para este horário.');
    });
  }

  const appointment: PatientAppointment = {
    id: `ap${(nextId += 1)}`,
    psychologistId: input.psychologist.id,
    psychologistName: input.psychologist.name,
    psychologistAvatar: input.psychologist.avatar,
    patientName: currentPatient.name,
    patientAvatar: currentPatient.avatar ?? '',
    specialty: input.psychologist.specialty,
    modality: input.psychologist.modality,
    date: input.slot.date,
    weekday: input.slot.weekday,
    time: input.slot.time,
    status: 'PENDENTE',
    createdAt: new Date().toISOString(),
  };
  db.unshift(appointment);

  // notificação interna simulada p/ o psicólogo
  pushNotification({
    kind: 'request',
    title: 'Nova solicitação de consulta',
    message: `${appointment.patientName} solicitou ${appointment.weekday}, ${appointment.date} às ${appointment.time}.`,
    audience: 'psychologist',
  });

  return delay({ ...appointment });
}

export async function cancelAppointment(
  id: string
): Promise<PatientAppointment> {
  if (!USE_MOCKS) {
    return apiRequest<PatientAppointment>(`/appointments/${id}/cancel`, { method: 'PATCH' });
  }
  const appt = db.find((a) => a.id === id);
  if (!appt) {
    return delay(null as never).then(() => {
      throw new ApiError('Consulta não encontrada.');
    });
  }
  const cancelable: AppointmentStatus[] = ['PENDENTE', 'CONFIRMADA'];
  if (!cancelable.includes(appt.status)) {
    return delay(null as never).then(() => {
      throw new ApiError('Esta consulta não pode ser cancelada.');
    });
  }
  appt.status = 'CANCELADA';
  return delay({ ...appt });
}

/* ------------------------------------------------------------------ */
/* Visão do psicólogo: consultas, aceite e recusa                      */
/* ------------------------------------------------------------------ */

/** Lista as consultas do psicólogo autenticado, mais recentes primeiro. */
export async function listPsychologistAppointments(): Promise<PatientAppointment[]> {
  if (!USE_MOCKS) return apiRequest<PatientAppointment[]>('/appointments/me');
  const items = db
    .filter((a) => a.psychologistId === CURRENT_PSYCHOLOGIST_ID)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((a) => ({ ...a }));
  return delay(items);
}

/**
 * Aceita uma solicitação → status CONFIRMADA.
 * REGRA: um horário não pode ser confirmado para mais de um paciente.
 */
export async function acceptAppointment(id: string): Promise<PatientAppointment> {
  if (!USE_MOCKS) {
    return apiRequest<PatientAppointment>(`/appointments/${id}/accept`, { method: 'PATCH' });
  }
  const appt = db.find((a) => a.id === id);
  if (!appt) {
    return delay(null as never).then(() => {
      throw new ApiError('Solicitação não encontrada.');
    });
  }
  if (appt.status !== 'PENDENTE') {
    return delay(null as never).then(() => {
      throw new ApiError('Somente solicitações pendentes podem ser aceitas.');
    });
  }
  const clash = db.some(
    (a) =>
      a.id !== id &&
      a.psychologistId === appt.psychologistId &&
      a.date === appt.date &&
      a.time === appt.time &&
      a.status === 'CONFIRMADA'
  );
  if (clash) {
    return delay(null as never).then(() => {
      throw new ApiError('Já existe uma consulta confirmada neste horário.');
    });
  }

  appt.status = 'CONFIRMADA';
  pushNotification({
    kind: 'confirm',
    title: 'Consulta confirmada',
    message: `${appt.psychologistName} confirmou sua consulta de ${appt.weekday}, ${appt.date} às ${appt.time}.`,
    audience: 'patient',
  });
  return delay({ ...appt });
}

/** Recusa uma solicitação → status RECUSADA. */
export async function rejectAppointment(id: string): Promise<PatientAppointment> {
  if (!USE_MOCKS) {
    return apiRequest<PatientAppointment>(`/appointments/${id}/reject`, { method: 'PATCH' });
  }
  const appt = db.find((a) => a.id === id);
  if (!appt) {
    return delay(null as never).then(() => {
      throw new ApiError('Solicitação não encontrada.');
    });
  }
  if (appt.status !== 'PENDENTE') {
    return delay(null as never).then(() => {
      throw new ApiError('Somente solicitações pendentes podem ser recusadas.');
    });
  }

  appt.status = 'RECUSADA';
  pushNotification({
    kind: 'reject',
    title: 'Consulta recusada',
    message: `${appt.psychologistName} não pôde aceitar sua consulta de ${appt.weekday}, ${appt.date} às ${appt.time}.`,
    audience: 'patient',
  });
  return delay({ ...appt });
}
