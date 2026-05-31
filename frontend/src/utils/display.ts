import type { AppointmentStatus, Modality } from '../types';

/** Rótulo legível da modalidade. */
export const modalityLabel: Record<Modality, string> = {
  online: 'Online',
  presencial: 'Presencial',
  hibrido: 'Híbrido',
};

/** Metadados de exibição de cada status de consulta (label + cor Mantine). */
export const statusMeta: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  PENDENTE: { label: 'Pendente', color: 'yellow' },
  CONFIRMADA: { label: 'Confirmada', color: 'psiGreen' },
  RECUSADA: { label: 'Recusada', color: 'red' },
  CANCELADA: { label: 'Cancelada', color: 'gray' },
  REALIZADA: { label: 'Realizada', color: 'psiTeal' },
};

/** Formata faixa de valor em reais. */
export function priceRangeLabel(min: number, max: number): string {
  if (min === max) return `R$ ${min}`;
  return `R$ ${min} – ${max}`;
}

/** Formata data ISO 'YYYY-MM-DD' para 'DD/MM'. */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}
