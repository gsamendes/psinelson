import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { Register } from '../Register';

describe('Register (tela de cadastro)', () => {
  it('renderiza campos de cadastro e seletor de perfil', () => {
    renderWithProviders(<Register />, { route: '/register' });
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByText('Sou Paciente')).toBeInTheDocument();
    expect(screen.getByText('Sou Psicólogo')).toBeInTheDocument();
  });
});
