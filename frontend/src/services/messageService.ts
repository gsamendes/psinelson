import { USE_MOCKS } from '../config/runtime';
import { apiRequest } from './apiClient';
import { delay } from './http';
import { adminMessages } from '../mocks/data';
import type { AdminMessage, Message, SendMessageRequest } from '../types';

/**
 * Service de mensagens administrativas com alternância mock/real.
 * Mock: usa o seed `adminMessages`. Real: GET/POST /messages (mapeando o
 * formato da API para o formato visual `AdminMessage`).
 */

/** Mapeia uma Message da API para o formato visual usado nas telas. */
function toAdminMessage(m: Message): AdminMessage {
  return {
    id: m.id,
    from: m.senderId,
    subject: m.subject ?? '(sem assunto)',
    body: m.body,
    date: m.createdAt,
    read: m.read,
    priority: 'normal',
  };
}

export async function listMessages(): Promise<AdminMessage[]> {
  if (USE_MOCKS) {
    return delay(adminMessages.map((m) => ({ ...m })));
  }
  const data = await apiRequest<Message[]>('/messages');
  return data.map(toAdminMessage);
}

export async function sendMessage(input: SendMessageRequest): Promise<Message> {
  if (USE_MOCKS) {
    return delay({
      id: `m${Date.now()}`,
      tenantId: 'demo-tenant',
      senderId: 'me',
      recipientId: input.recipientId,
      subject: input.subject,
      body: input.body,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return apiRequest<Message>('/messages', { method: 'POST', body: input });
}
