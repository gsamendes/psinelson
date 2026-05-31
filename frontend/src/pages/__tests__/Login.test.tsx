import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Login } from '../Login';
import { useAuthStore } from '../../stores/authStore';

describe('Login (tela de entrada)', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('renderiza campos e seletor de perfil', () => {
    renderWithProviders(<Login />, { route: '/login' });
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByText('Sou Paciente')).toBeInTheDocument();
    expect(screen.getByText('Sou Psicólogo')).toBeInTheDocument();
  });

  it('login simulado autentica como paciente por padrão', async () => {
    renderWithProviders(<Login />, { route: '/login' });
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe('patient');
  });

  it('seleção de perfil psicólogo reflete no login', async () => {
    renderWithProviders(<Login />, { route: '/login' });
    await userEvent.click(screen.getByText('Sou Psicólogo'));
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(useAuthStore.getState().user?.role).toBe('psychologist');
  });
});
