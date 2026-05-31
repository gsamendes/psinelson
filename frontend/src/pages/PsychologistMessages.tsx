import { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconBell, IconMail, IconMailOpened } from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import {
  useMarkNotificationsRead,
  useNotifications,
} from '../hooks/usePsychologistConsole';
import { adminMessages as adminMessagesSeed } from '../mocks/data';
import type { AdminMessage } from '../types';
import { palette } from '../theme';

/** Formata ISO timestamp em 'DD/MM HH:mm'. */
function fmt(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
}

export function PsychologistMessages() {
  // mensagens administrativas vivem só nesta tela (estado local — mock)
  const [messages, setMessages] = useState<AdminMessage[]>(adminMessagesSeed);
  const { data: notifs } = useNotifications('psychologist');
  const markRead = useMarkNotificationsRead('psychologist');

  function toggleRead(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    );
  }

  return (
    <PageSkeleton
      title="Mensagens"
      subtitle="Comunicados administrativos e notificações internas. Sem tempo real nesta fase."
    >
      {/* Mensagens administrativas */}
      <Box>
        <Text fw={700} fz={16} mb="md">
          Mensagens administrativas
        </Text>
        <Stack gap="sm">
          {messages.map((m) => (
            <Group
              key={m.id}
              justify="space-between"
              wrap="nowrap"
              className="psi-card"
              p="md"
              align="flex-start"
            >
              <Group gap={14} wrap="nowrap" align="flex-start">
                <ThemeIcon
                  variant="light"
                  color={m.read ? 'gray' : 'psiGreen'}
                  radius="xl"
                  size={40}
                >
                  {m.read ? <IconMailOpened size={20} /> : <IconMail size={20} />}
                </ThemeIcon>
                <Box>
                  <Group gap={8}>
                    <Text fw={700} fz={14}>
                      {m.subject}
                    </Text>
                    {m.priority === 'alta' && (
                      <Badge color="red" variant="light" radius="sm" size="sm">
                        Alta
                      </Badge>
                    )}
                    {!m.read && (
                      <Badge color="psiGreen" variant="filled" radius="sm" size="sm">
                        Nova
                      </Badge>
                    )}
                  </Group>
                  <Text fz={12} c={palette.textSecondary}>
                    {m.from} • {fmt(m.date)}
                  </Text>
                  <Text fz={13} mt={6}>
                    {m.body}
                  </Text>
                </Box>
              </Group>
              <Button
                size="xs"
                variant="subtle"
                color="psiGreen"
                onClick={() => toggleRead(m.id)}
              >
                {m.read ? 'Marcar não lida' : 'Marcar lida'}
              </Button>
            </Group>
          ))}
        </Stack>
      </Box>

      {/* Notificações internas */}
      <Box>
        <Group justify="space-between" mb="md">
          <Text fw={700} fz={16}>
            Notificações internas
          </Text>
          <Button
            size="xs"
            variant="light"
            color="psiGreen"
            radius="xl"
            loading={markRead.isPending}
            onClick={() => markRead.mutate()}
          >
            Marcar todas como lidas
          </Button>
        </Group>
        {!notifs || notifs.length === 0 ? (
          <Box className="psi-card" p={32} style={{ display: 'grid', placeItems: 'center' }}>
            <Text fz={13} c={palette.textSecondary}>
              Sem notificações.
            </Text>
          </Box>
        ) : (
          <Stack gap="sm">
            {notifs.map((n) => (
              <Group key={n.id} gap={12} wrap="nowrap" className="psi-card" p="md">
                <ThemeIcon
                  variant="light"
                  color={n.read ? 'gray' : 'psiTeal'}
                  radius="xl"
                  size={38}
                >
                  <IconBell size={18} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Group gap={8}>
                    <Text fw={600} fz={14}>
                      {n.title}
                    </Text>
                    {!n.read && (
                      <Badge color="psiTeal" variant="filled" radius="sm" size="sm">
                        Nova
                      </Badge>
                    )}
                  </Group>
                  <Text fz={13} c={palette.textSecondary}>
                    {n.message}
                  </Text>
                  <Text fz={11} c={palette.textSecondary} mt={2}>
                    {fmt(n.createdAt)}
                  </Text>
                </Box>
              </Group>
            ))}
          </Stack>
        )}
      </Box>
    </PageSkeleton>
  );
}
