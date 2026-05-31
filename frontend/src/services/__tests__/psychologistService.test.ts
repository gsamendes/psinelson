import { describe, it, expect } from 'vitest';
import {
  getPsychologistById,
  listPsychologists,
} from '../psychologistService';
import type { PsychologistFilters } from '../../types';
import { maxPriceCap } from '../../mocks/data';

const baseFilters: PsychologistFilters = {
  specialty: '',
  modality: 'all',
  location: '',
  weekday: '',
  maxPrice: maxPriceCap,
};

describe('psychologistService (mock)', () => {
  it('lista todos os psicólogos sem filtros', async () => {
    const list = await listPsychologists(baseFilters);
    expect(list.length).toBeGreaterThan(0);
  });

  it('filtra por especialidade (filtro permitido)', async () => {
    const list = await listPsychologists({ ...baseFilters, specialty: 'Ansiedade' });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.specialty === 'Ansiedade')).toBe(true);
  });

  it('filtra por modalidade online', async () => {
    const list = await listPsychologists({ ...baseFilters, modality: 'online' });
    expect(list.every((p) => p.modality === 'online')).toBe(true);
  });

  it('retorna detalhe por id', async () => {
    const p = await getPsychologistById('p1');
    expect(p.id).toBe('p1');
    expect(p.crp).toBeTruthy();
  });

  it('lança erro controlado para id inexistente', async () => {
    await expect(getPsychologistById('zzz')).rejects.toThrow(/não encontrado/i);
  });
});
