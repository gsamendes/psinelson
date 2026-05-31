import type { InternalNotification, NotificationKind, UserRole } from '../types';
import { delay } from './http';
import { USE_MOCKS } from '../config/runtime';
import { apiRequest } from './apiClient';

/**
 * Service de notificações internas SIMULADAS (sem tempo real / push).
 * Mantém um "banco" em memória durante a sessão. No 8º período, trocar por
 * GET /notifications + WebSocket/polling sem alterar as telas.
 */

let nextId = 100;

const db: InternalNotification[] = [
  {
    id: 'n1',
    kind: 'request',
    title: 'Nova solicitação de consulta',
    message: 'Rafael Lima solicitou um horário para Ter, 02/06 às 10:00.',
    createdAt: '2026-05-29T12:00:00.000Z',
    read: false,
    audience: 'psychologist',
  },
  {
    id: 'n2',
    kind: 'system',
    title: 'Disponibilidade publicada',
    message: 'Seus horários ficaram visíveis para pacientes na busca.',
    createdAt: '2026-05-28T10:00:00.000Z',
    read: true,
    audience: 'psychologist',
  },
];

/** Lista notificações de um público (psicólogo ou paciente), mais recentes primeiro. */
export async function listNotifications(
  audience: UserRole
): Promise<InternalNotification[]> {
  if (!USE_MOCKS) return apiRequest<InternalNotification[]>('/notifications/me');
  const items = db
    .filter((n) => n.audience === audience)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((n) => ({ ...n }));
  return delay(items, 300);
}

/** Cria uma notificação interna simulada. Uso interno dos services. */
export function pushNotification(input: {
  kind: NotificationKind;
  title: string;
  message: string;
  audience: UserRole;
}): InternalNotification {
  const notification: InternalNotification = {
    id: `n${(nextId += 1)}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...input,
  };
  db.unshift(notification);
  return notification;
}

/** Marca todas as notificações de um público como lidas. */
export async function markAllRead(audience: UserRole): Promise<void> {
  if (!USE_MOCKS) {
    await apiRequest<{ ok: boolean }>('/notifications/me/read-all', { method: 'PATCH' });
    return;
  }
  db.forEach((n) => {
    if (n.audience === audience) n.read = true;
  });
  return delay(undefined, 200);
}
