import type { UserRole } from './user';

/** Tipo da notificação interna simulada. */
export type NotificationKind =
  | 'request'
  | 'confirm'
  | 'reject'
  | 'cancel'
  | 'system';

/** Notificação interna simulada (sem tempo real / push). */
export interface InternalNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
  /** Para quem a notificação é destinada. */
  audience: UserRole;
}
