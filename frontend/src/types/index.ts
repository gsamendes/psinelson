// Barril de tipos. As entidades vivem em arquivos por domínio (user, auth,
// psychologist, availability, appointment, notification, message) e são
// reexportadas aqui — imports antigos `from '../types'` continuam válidos.
export * from './user';
export * from './auth';
export * from './psychologist';
export * from './availability';
export * from './appointment';
export * from './notification';
export * from './message';

// ----------------------------------------------------------------------------
// Tipos exclusivos do dashboard do paciente (visuais, sem equivalente na API).
// ----------------------------------------------------------------------------

export type MoodLevel = 'great' | 'good' | 'meh' | 'bad' | 'awful';

export interface MoodOption {
  level: MoodLevel;
  label: string;
  color: string;
}

export interface WellnessPoint {
  label: string;
  value: number;
}

export interface Goal {
  id: string;
  label: string;
  progress: number;
  color: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: string;
  statusColor: string;
  kind: 'appointment' | 'exercise';
}
