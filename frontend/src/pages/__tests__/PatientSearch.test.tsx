import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { PatientSearch } from '../PatientSearch';

describe('PatientSearch (busca com filtros permitidos)', () => {
  it('exibe os filtros permitidos', () => {
    renderWithProviders(<PatientSearch />, { route: '/patient/search' });
    expect(screen.getByText('Encontrar Psicólogos')).toBeInTheDocument();
    expect(screen.getByText('Especialidade')).toBeInTheDocument();
    expect(screen.getByText('Modalidade')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidade')).toBeInTheDocument();
    expect(screen.getByText('Localização')).toBeInTheDocument();
    expect(screen.getAllByText(/faixa de valor/i).length).toBeGreaterThan(0);
  });

  it('NÃO expõe filtros sensíveis/discriminatórios', () => {
    renderWithProviders(<PatientSearch />, { route: '/patient/search' });
    expect(screen.queryByText(/gênero/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/raça/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/religião/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/orientação/i)).not.toBeInTheDocument();
  });
});
