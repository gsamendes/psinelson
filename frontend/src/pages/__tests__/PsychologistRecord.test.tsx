import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import { PsychologistRecord } from '../PsychologistRecord';

describe('PsychologistRecord (placeholder seguro de prontuário)', () => {
  it('exibe aviso de área restrita e prontuário bloqueado', () => {
    renderWithProviders(<PsychologistRecord />, { route: '/psychologist/record' });
    expect(screen.getAllByText(/demonstração/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/área restrita/i)).toBeInTheDocument();
    expect(screen.getAllByText(/bloqueado/i).length).toBeGreaterThan(0);
  });

  it('deixa explícitos os requisitos de segurança (RBAC, tenant, vínculo, auditoria)', () => {
    renderWithProviders(<PsychologistRecord />, { route: '/psychologist/record' });
    expect(screen.getByText(/RBAC/)).toBeInTheDocument();
    expect(screen.getByText(/tenant_id/i)).toBeInTheDocument();
    expect(screen.getByText(/vínculo terapêutico/i)).toBeInTheDocument();
    expect(screen.getByText(/auditoria/i)).toBeInTheDocument();
  });

  it('não exibe dados clínicos reais (sem anotações/evolução clínica visíveis)', () => {
    renderWithProviders(<PsychologistRecord />, { route: '/psychologist/record' });
    // O texto fala em proteção; não deve haver conteúdo clínico real exposto.
    expect(screen.getByText(/conteúdo clínico protegido/i)).toBeInTheDocument();
  });
});
