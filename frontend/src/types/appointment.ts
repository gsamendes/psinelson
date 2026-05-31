import type { Modality, Psychologist } from './psychologist';

/** Estados do agendamento. Fluxo: solicitação → análise do psicólogo →
 *  aceite/recusa. NUNCA confirma automático: nasce sempre 'PENDENTE'. */
export type AppointmentStatus =
  | 'PENDENTE'
  | 'CONFIRMADA'
  | 'RECUSADA'
  | 'CANCELADA'
  | 'REALIZADA';

/** Consulta (mock — futura tabela de appointments). Compartilhada pelas duas
 *  visões: paciente (Minhas Consultas) e psicólogo (Solicitações/Agenda). */
export interface PatientAppointment {
  id: string;
  psychologistId: string;
  psychologistName: string;
  psychologistAvatar: string;
  /** Paciente que solicitou — usado na visão do psicólogo. */
  patientName: string;
  patientAvatar: string;
  specialty: string;
  modality: Modality;
  /** Data ISO 'YYYY-MM-DD'. */
  date: string;
  weekday: string;
  time: string;
  status: AppointmentStatus;
  /** ISO timestamp da solicitação. */
  createdAt: string;
}

/** Card de consulta usado no dashboard do paciente (legado/visual). */
export interface Appointment {
  id: string;
  psychologist: Pick<Psychologist, 'name' | 'approach' | 'avatar'>;
  date: string;
  time: string;
  modality: 'Online' | 'Presencial';
  status?: 'Realizada' | 'Agendada' | 'Cancelada';
}
