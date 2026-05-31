import type {
  AdminMessage,
  Appointment,
  Goal,
  HistoryItem,
  LinkedPatient,
  MoodOption,
  Psychologist,
  PsychologistSlot,
  User,
  WellnessPoint,
} from '../types';

export const currentPatient: User = {
  id: 'u1',
  name: 'Camila Souza',
  email: 'camila.souza@email.com',
  role: 'patient',
  avatar:
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces',
};

/** Psicólogo autenticado (mock). Vinculado ao perfil 'p1' da listagem. */
export const currentPsychologist: User = {
  id: 'p1',
  name: 'Dra. Ana Costa',
  email: 'ana.costa@email.com',
  role: 'psychologist',
  avatar:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces',
};

export const moodOptions: MoodOption[] = [
  { level: 'great', label: 'Muito bem', color: '#5F9E6E' },
  { level: 'good', label: 'Bem', color: '#7FB069' },
  { level: 'meh', label: 'Mais ou menos', color: '#E2B33C' },
  { level: 'bad', label: 'Mal', color: '#E08A4B' },
  { level: 'awful', label: 'Muito mal', color: '#D9694C' },
];

/** Gera slots fictícios a partir de uma lista [weekday, date, time]. */
function slots(
  raw: ReadonlyArray<[string, string, string]>,
  prefix: string
) {
  return raw.map(([weekday, date, time], i) => ({
    id: `${prefix}-s${i + 1}`,
    weekday,
    date,
    time,
  }));
}

export const psychologists: Psychologist[] = [
  {
    id: 'p1',
    name: 'Dra. Ana Costa',
    crp: 'CRP 06/123456',
    approach: 'Terapia Cognitivo-Comportamental',
    specialty: 'Ansiedade',
    rating: 4.9,
    reviews: 128,
    modality: 'hibrido',
    location: 'São Paulo - SP',
    priceMin: 120,
    priceMax: 180,
    description:
      'Psicóloga clínica com foco em transtornos de ansiedade e estresse. Atendimento acolhedor baseado em evidências (TCC).',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces',
    availableSlots: slots(
      [
        ['Seg', '2026-06-01', '14:00'],
        ['Seg', '2026-06-01', '15:00'],
        ['Qua', '2026-06-03', '09:00'],
        ['Sex', '2026-06-05', '17:00'],
      ],
      'p1'
    ),
  },
  {
    id: 'p2',
    name: 'Dr. Bruno Almeida',
    crp: 'CRP 06/234567',
    approach: 'Psicanálise',
    specialty: 'Depressão',
    rating: 4.7,
    reviews: 86,
    modality: 'online',
    location: 'Rio de Janeiro - RJ',
    priceMin: 150,
    priceMax: 220,
    description:
      'Atendimento psicanalítico para quadros depressivos e questões existenciais. Escuta cuidadosa e sigilosa.',
    avatar:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces',
    availableSlots: slots(
      [
        ['Ter', '2026-06-02', '10:00'],
        ['Ter', '2026-06-02', '11:00'],
        ['Qui', '2026-06-04', '19:00'],
      ],
      'p2'
    ),
  },
  {
    id: 'p3',
    name: 'Dra. Carla Menezes',
    crp: 'CRP 06/345678',
    approach: 'Terapia Cognitivo-Comportamental',
    specialty: 'Relacionamentos',
    rating: 4.8,
    reviews: 142,
    modality: 'presencial',
    location: 'Belo Horizonte - MG',
    priceMin: 100,
    priceMax: 140,
    description:
      'Especialista em terapia de casal e conflitos relacionais. Abordagem prática e orientada a objetivos.',
    avatar:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=faces',
    availableSlots: slots(
      [
        ['Seg', '2026-06-01', '08:00'],
        ['Qua', '2026-06-03', '16:00'],
      ],
      'p3'
    ),
  },
  {
    id: 'p4',
    name: 'Dr. Diego Ferreira',
    crp: 'CRP 06/456789',
    approach: 'Terapia Humanista',
    specialty: 'Autoestima',
    rating: 4.6,
    reviews: 64,
    modality: 'hibrido',
    location: 'São Paulo - SP',
    priceMin: 90,
    priceMax: 130,
    description:
      'Foco em autoconhecimento, autoestima e desenvolvimento pessoal numa perspectiva humanista.',
    avatar:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces',
    availableSlots: slots(
      [
        ['Qui', '2026-06-04', '13:00'],
        ['Sex', '2026-06-05', '14:00'],
        ['Sex', '2026-06-05', '15:00'],
      ],
      'p4'
    ),
  },
  {
    id: 'p5',
    name: 'Dra. Elaine Rocha',
    crp: 'CRP 06/567890',
    approach: 'Terapia Cognitivo-Comportamental',
    specialty: 'Estresse',
    rating: 4.9,
    reviews: 201,
    modality: 'online',
    location: 'Curitiba - PR',
    priceMin: 130,
    priceMax: 190,
    description:
      'Atendimento de burnout e estresse ocupacional. Estratégias práticas de regulação emocional.',
    avatar:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=faces',
    availableSlots: slots(
      [
        ['Seg', '2026-06-01', '18:00'],
        ['Ter', '2026-06-02', '18:00'],
      ],
      'p5'
    ),
  },
  {
    id: 'p6',
    name: 'Dr. Felipe Tavares',
    crp: 'CRP 06/678901',
    approach: 'Psicanálise',
    specialty: 'Ansiedade',
    rating: 4.5,
    reviews: 49,
    modality: 'presencial',
    location: 'Rio de Janeiro - RJ',
    priceMin: 110,
    priceMax: 160,
    description:
      'Trabalho clínico com ansiedade e pânico, em escuta analítica de longo prazo.',
    avatar:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=faces',
    availableSlots: [],
  },
];

/** Psicólogo destacado no dashboard do paciente. */
export const psychologist: Psychologist = psychologists[0];

/** Opções de filtro PERMITIDAS, derivadas dos mocks. */
export const specialtyOptions = Array.from(
  new Set(psychologists.map((p) => p.specialty))
).sort();

export const locationOptions = Array.from(
  new Set(psychologists.map((p) => p.location))
).sort();

export const weekdayOptions = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** Teto absoluto de preço entre os mocks — usado no slider de faixa de valor. */
export const maxPriceCap = Math.max(...psychologists.map((p) => p.priceMax));

export const nextAppointment: Appointment = {
  id: 'a1',
  psychologist: {
    name: psychologist.name,
    approach: psychologist.approach,
    avatar: psychologist.avatar,
  },
  date: 'Quinta, 15 Ago',
  time: '15:00',
  modality: 'Online',
};

export const wellnessData: WellnessPoint[] = [
  { label: 'Sex', value: 3.0 },
  { label: 'Sáb', value: 2.6 },
  { label: 'Dom', value: 3.4 },
  { label: 'Seg', value: 3.2 },
  { label: 'Ter', value: 3.0 },
  { label: 'Qua', value: 3.6 },
  { label: 'Hoje', value: 3.8 },
];

export const goals: Goal[] = [
  { id: 'g1', label: 'Reduzir a ansiedade', progress: 70, color: '#5F9E6E' },
  { id: 'g2', label: 'Dormir melhor', progress: 40, color: '#E2B33C' },
  { id: 'g3', label: 'Mais autoestima', progress: 60, color: '#5B9FB0' },
];

export const recentHistory: HistoryItem[] = [
  {
    id: 'h1',
    title: 'Consulta com',
    subtitle: 'Dra. Ana Costa',
    date: '08 Ago • 15:00',
    status: 'Realizada',
    statusColor: '#5F9E6E',
    kind: 'appointment',
  },
  {
    id: 'h2',
    title: 'Exercício de Respiração',
    subtitle: 'Concluído',
    date: '06 Ago',
    status: 'Concluído',
    statusColor: '#5B9FB0',
    kind: 'exercise',
  },
  {
    id: 'h3',
    title: 'Consulta com',
    subtitle: 'Dra. Ana Costa',
    date: '01 Ago • 15:00',
    status: 'Realizada',
    statusColor: '#5F9E6E',
    kind: 'appointment',
  },
];

export const selfCare = {
  current: 7,
  total: 10,
  message: 'Você está indo bem!',
  hint: 'Continue assim com seus hábitos de autocuidado.',
};

/* ------------------------------------------------------------------ */
/* Dados do psicólogo (demonstração — sem dados clínicos reais)        */
/* ------------------------------------------------------------------ */

/** Pacientes vinculados fictícios — apenas dados de demonstração. */
export const linkedPatients: LinkedPatient[] = [
  {
    id: 'pt1',
    name: 'Camila Souza',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces',
    focus: 'Ansiedade',
    since: '2026-03-10',
    sessions: 8,
  },
  {
    id: 'pt2',
    name: 'Rafael Lima',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
    focus: 'Estresse ocupacional',
    since: '2026-04-02',
    sessions: 5,
  },
  {
    id: 'pt3',
    name: 'Beatriz Nunes',
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=160&h=160&fit=crop&crop=faces',
    focus: 'Autoestima',
    since: '2026-04-20',
    sessions: 3,
  },
];

/** Horários cadastrados pelo psicólogo (seed do "banco" de disponibilidade). */
export const psychologistSlotsSeed: PsychologistSlot[] = [
  { id: 'av1', weekday: 'Seg', date: '2026-06-01', time: '14:00', modality: 'online' },
  { id: 'av2', weekday: 'Seg', date: '2026-06-01', time: '15:00', modality: 'online' },
  { id: 'av3', weekday: 'Qua', date: '2026-06-03', time: '09:00', modality: 'presencial' },
  { id: 'av4', weekday: 'Sex', date: '2026-06-05', time: '17:00', modality: 'hibrido' },
];

/** Mensagens administrativas simuladas (sem tempo real). */
export const adminMessages: AdminMessage[] = [
  {
    id: 'm1',
    from: 'Equipe PsiApp',
    subject: 'Bem-vinda à plataforma',
    body: 'Seu perfil profissional foi ativado. Mantenha sua disponibilidade atualizada para receber solicitações de pacientes.',
    date: '2026-05-28T09:00:00.000Z',
    read: true,
    priority: 'normal',
  },
  {
    id: 'm2',
    from: 'Suporte PsiApp',
    subject: 'Verificação de CRP',
    body: 'Lembrete: anexe a documentação do seu CRP nas configurações para manter o selo de profissional verificado.',
    date: '2026-05-29T14:30:00.000Z',
    read: false,
    priority: 'alta',
  },
  {
    id: 'm3',
    from: 'Equipe PsiApp',
    subject: 'Atualização de termos',
    body: 'Os termos de uso para profissionais foram atualizados. Revise as diretrizes de sigilo e atendimento.',
    date: '2026-05-30T08:15:00.000Z',
    read: false,
    priority: 'normal',
  },
];
