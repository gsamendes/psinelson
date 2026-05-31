/** Modalidade de atendimento permitida. */
export type Modality = 'online' | 'presencial' | 'hibrido';

/** Horário disponibilizado pelo psicólogo (visão do paciente). */
export interface AvailableSlot {
  id: string;
  /** Data ISO 'YYYY-MM-DD'. */
  date: string;
  /** Rótulo curto do dia, ex: 'Seg'. */
  weekday: string;
  /** Hora 'HH:mm'. */
  time: string;
}

export interface Psychologist {
  id: string;
  name: string;
  /** CRP fictício — dado de demonstração. */
  crp: string;
  /** Abordagem terapêutica, ex: 'Terapia Cognitivo-Comportamental'. */
  approach: string;
  /** Especialidade (filtro permitido), ex: 'Ansiedade'. */
  specialty: string;
  rating: number;
  reviews: number;
  modality: Modality;
  /** Cidade/UF — filtro permitido. */
  location: string;
  /** Faixa de valor por sessão (R$). */
  priceMin: number;
  priceMax: number;
  description: string;
  availableSlots: AvailableSlot[];
  avatar: string;
}

/** Filtros PERMITIDOS de busca. Nenhum filtro sensível/discriminatório
 *  (gênero, raça, religião, orientação) é exposto — regra de negócio. */
export interface PsychologistFilters {
  specialty: string; // '' = todas
  modality: Modality | 'all';
  location: string; // '' = todas
  /** Dia da semana desejado, ex: 'Seg'. '' = qualquer. */
  weekday: string;
  /** Teto de preço (R$) do filtro de faixa de valor. */
  maxPrice: number;
}
