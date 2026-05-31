import { psychologists } from '../mocks/data';
import type { Psychologist, PsychologistFilters } from '../types';
import { ApiError, delay } from './http';
import { USE_MOCKS } from '../config/runtime';
import { apiRequest } from './apiClient';

/**
 * Service de psicólogos com alternância mock/real. A assinatura pública não
 * muda entre os modos. Em modo real chama GET /psychologists e /:id.
 * TODO(integração): mapear o PsychologistProfile da API para `Psychologist`.
 */

/** Aplica os filtros PERMITIDOS sobre a lista. */
function applyFilters(
  list: Psychologist[],
  f: PsychologistFilters
): Psychologist[] {
  return list.filter((p) => {
    if (f.specialty && p.specialty !== f.specialty) return false;
    if (f.modality !== 'all' && p.modality !== f.modality) return false;
    if (f.location && p.location !== f.location) return false;
    if (f.maxPrice && p.priceMin > f.maxPrice) return false;
    if (f.weekday && !p.availableSlots.some((s) => s.weekday === f.weekday))
      return false;
    return true;
  });
}

export async function listPsychologists(
  filters: PsychologistFilters
): Promise<Psychologist[]> {
  if (!USE_MOCKS) {
    return apiRequest<Psychologist[]>('/psychologists', {
      query: {
        specialty: filters.specialty || undefined,
        modality: filters.modality !== 'all' ? filters.modality : undefined,
        location: filters.location || undefined,
        weekday: filters.weekday || undefined,
        maxPrice: filters.maxPrice || undefined,
      },
    });
  }
  return delay(applyFilters(psychologists, filters));
}

export async function getPsychologistById(id: string): Promise<Psychologist> {
  if (!USE_MOCKS) {
    return apiRequest<Psychologist>(`/psychologists/${id}`);
  }
  const found = psychologists.find((p) => p.id === id);
  if (!found) {
    return delay(null as never).then(() => {
      throw new ApiError('Psicólogo não encontrado.');
    });
  }
  return delay(found);
}
