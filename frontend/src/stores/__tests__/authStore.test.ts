import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

describe('authStore (login simulado por papel)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('login como paciente define usuário paciente autenticado', () => {
    useAuthStore.getState().login('patient');
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe('patient');
  });

  it('login como psicólogo define usuário psicólogo autenticado', () => {
    useAuthStore.getState().login('psychologist');
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user?.role).toBe('psychologist');
  });

  it('logout limpa a sessão', () => {
    useAuthStore.getState().login('patient');
    useAuthStore.getState().logout();
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it('signIn (modo mock) autentica e retorna o papel', async () => {
    const role = await useAuthStore.getState().signIn('camila.souza@email.com', '123456');
    expect(role).toBe('patient');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe('camila.souza@email.com');
  });
});
