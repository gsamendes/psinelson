/** Papel do usuário no frontend (minúsculo). A API usa o enum em maiúsculo —
 *  ver `ApiUserRole` em ./auth e o mapeamento no authService. */
export type UserRole = 'patient' | 'psychologist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/** Paciente vinculado fictício (demonstração — sem dados clínicos reais). */
export interface LinkedPatient {
  id: string;
  name: string;
  avatar: string;
  /** Tema/foco do acompanhamento (fictício). */
  focus: string;
  /** Vínculo desde — ISO 'YYYY-MM-DD'. */
  since: string;
  sessions: number;
}
