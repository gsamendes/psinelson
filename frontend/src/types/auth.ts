/** Papel como retornado/esperado pela API real. */
export type ApiUserRole = 'PATIENT' | 'PSYCHOLOGIST' | 'ADMIN';

export interface RegisterRequest {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  role?: ApiUserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Usuário autenticado conforme a API (inclui tenantId). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: ApiUserRole;
  tenantId: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
