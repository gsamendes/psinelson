import type { Modality, PsychologistSlot } from '../types';
import { psychologistSlotsSeed } from '../mocks/data';
import { ApiError, delay } from './http';

/**
 * Service de disponibilidade do psicólogo. "Banco" em memória que simula
 * persistência durante a sessão. No 8º período: GET/POST/PATCH/DELETE
 * /psychologists/me/slots sem alterar as telas.
 */

let nextId = 100;

// cópia do seed para não mutar o mock importado
const db: PsychologistSlot[] = psychologistSlotsSeed.map((s) => ({ ...s }));

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** Deriva o rótulo curto do dia ('Seg', 'Ter'...) a partir da data ISO. */
function weekdayFromDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return WEEKDAYS[d.getDay()] ?? '';
}

export interface SlotInput {
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  modality: Modality;
}

function isDuplicate(input: SlotInput, ignoreId?: string): boolean {
  return db.some(
    (s) =>
      s.id !== ignoreId && s.date === input.date && s.time === input.time
  );
}

function ordered(): PsychologistSlot[] {
  return [...db].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  );
}

export async function listSlots(): Promise<PsychologistSlot[]> {
  return delay(ordered().map((s) => ({ ...s })));
}

export async function addSlot(input: SlotInput): Promise<PsychologistSlot> {
  if (!input.date || !input.time) {
    return delay(null as never).then(() => {
      throw new ApiError('Informe data e horário.');
    });
  }
  if (isDuplicate(input)) {
    return delay(null as never).then(() => {
      throw new ApiError('Já existe um horário cadastrado nessa data e hora.');
    });
  }
  const slot: PsychologistSlot = {
    id: `av${(nextId += 1)}`,
    date: input.date,
    weekday: weekdayFromDate(input.date),
    time: input.time,
    modality: input.modality,
  };
  db.push(slot);
  return delay({ ...slot });
}

export async function updateSlot(
  id: string,
  input: SlotInput
): Promise<PsychologistSlot> {
  const slot = db.find((s) => s.id === id);
  if (!slot) {
    return delay(null as never).then(() => {
      throw new ApiError('Horário não encontrado.');
    });
  }
  if (isDuplicate(input, id)) {
    return delay(null as never).then(() => {
      throw new ApiError('Já existe um horário cadastrado nessa data e hora.');
    });
  }
  slot.date = input.date;
  slot.weekday = weekdayFromDate(input.date);
  slot.time = input.time;
  slot.modality = input.modality;
  return delay({ ...slot });
}

export async function removeSlot(id: string): Promise<void> {
  const i = db.findIndex((s) => s.id === id);
  if (i === -1) {
    return delay(null as never).then(() => {
      throw new ApiError('Horário não encontrado.');
    });
  }
  db.splice(i, 1);
  return delay(undefined);
}
