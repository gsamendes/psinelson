import { API_URL } from '../config/runtime';
import { ApiError } from './http';

/**
 * Cliente HTTP fino para a API real (usado quando `USE_MOCKS === false`).
 * Stateless: envia o access token (Bearer) e o `x-tenant-id` quando presentes
 * no localStorage. Não roda por padrão — os services seguem em modo mock.
 */

const TOKEN_KEY = 'psiapp-token';
const TENANT_KEY = 'psiapp-tenant';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY) ?? undefined,
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const tenantStorage = {
  get: () => localStorage.getItem(TENANT_KEY) ?? undefined,
  set: (t: string) => localStorage.setItem(TENANT_KEY, t),
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Quando false, não envia Authorization (rotas públicas como login). */
  auth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const tenant = tenantStorage.get();
  if (tenant) headers['x-tenant-id'] = tenant;

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(data.error ?? `Erro ${res.status} ao chamar ${path}.`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
