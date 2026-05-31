import type { Modality } from './psychologist';

/** Horário cadastrado pelo psicólogo (gestão de disponibilidade).
 *  Difere de AvailableSlot por carregar a modalidade do atendimento. */
export interface PsychologistSlot {
  id: string;
  /** Data ISO 'YYYY-MM-DD'. */
  date: string;
  /** Rótulo curto do dia, ex: 'Seg'. */
  weekday: string;
  /** Hora 'HH:mm'. */
  time: string;
  modality: Modality;
}
