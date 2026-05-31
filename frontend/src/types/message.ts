/** Mensagem administrativa simulada (sem tempo real). */
export interface AdminMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  /** ISO timestamp. */
  date: string;
  read: boolean;
  priority: 'normal' | 'alta';
}

/** Mensagem conforme a API real (GET/POST /messages). */
export interface Message {
  id: string;
  tenantId: string;
  senderId: string;
  recipientId: string;
  subject?: string;
  body: string;
  read: boolean;
  /** ISO timestamp. */
  createdAt: string;
}

export interface SendMessageRequest {
  recipientId: string;
  subject?: string;
  body: string;
}
