import { USE_MOCKS } from '../config/runtime';
import { apiRequest, tenantStorage, tokenStorage } from './apiClient';
import { delay } from './http';
import { currentPatient, currentPsychologist } from '../mocks/data';
import type {
  ApiUserRole,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types';

/**
 * Service de autenticação com alternância mock/real.
 * Em modo mock (padrão), devolve um usuário simulado sem chamar a rede,
 * preservando o login fake atual. Em modo real, fala com /auth/* e persiste
 * o token (stateless via JWT).
 */

const MOCK_TENANT = 'demo-tenant';

/** Converte o papel do frontend (minúsculo) para o enum da API. */
export function toApiRole(role: User['role']): ApiUserRole {
  return role === 'psychologist' ? 'PSYCHOLOGIST' : 'PATIENT';
}

function mockAuthUser(role: User['role']): AuthUser {
  const u = role === 'psychologist' ? currentPsychologist : currentPatient;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: toApiRole(role),
    tenantId: MOCK_TENANT,
  };
}

export async function login(input: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCKS) {
    return delay({
      user: mockAuthUser('patient'),
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
  }
  const res = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: input,
    auth: false,
  });
  tokenStorage.set(res.accessToken);
  tenantStorage.set(res.user.tenantId);
  return res;
}

export async function register(input: RegisterRequest): Promise<AuthUser> {
  if (USE_MOCKS) {
    return delay(mockAuthUser(input.role === 'PSYCHOLOGIST' ? 'psychologist' : 'patient'));
  }
  return apiRequest<AuthUser>('/auth/register', {
    method: 'POST',
    body: input,
    auth: false,
  });
}

export async function me(): Promise<AuthUser> {
  if (USE_MOCKS) {
    return delay(mockAuthUser('patient'));
  }
  return apiRequest<AuthUser>('/auth/me');
}

export function logout(): void {
  tokenStorage.clear();
}
