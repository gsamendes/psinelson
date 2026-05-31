import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBell,
  IconCalendarCheck,
  IconCalendarClock,
  IconChevronRight,
  IconClockHour4,
  IconUsers,
} from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { StatCard } from '../components/common/StatCard';
import {
  useNotifications,
  usePsychologistAppointments,
} from '../hooks/usePsychologistConsole';
import { linkedPatients } from '../mocks/data';
import type { PatientAppointment } from '../types';
import { palette } from '../theme';
import { modalityLabel, shortDate, statusMeta } from '../utils/display';

export function PsychologistDashboard() {
  const navigate = useNavigate();
  const { data: appts, isPending } = usePsychologistAppointments();
  const { data: notifs } = useNotifications('psychologist');

  const pending = appts?.filter((a) => a.status === 'PENDENTE') ?? [];
  const confirmed = appts?.filter((a) => a.status === 'CONFIRMADA') ?? [];
  const upcoming = [...confirmed].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  );
  const unread = notifs?.filter((n) => !n.read).length ?? 0;

  return (
    <PageSkeleton
      title="Painel do Psicólogo"
      subtitle="Visão geral da sua agenda, solicitações e pacientes vinculados."
    >
      {isPending ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={120} radius={22} />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          <StatCard
            icon={<IconCalendarClock size={22} />}
            color="yellow"
            value={pending.length}
            label="Consultas pendentes"
            onClick={() => navigate('/psychologist/requests')}
          />
          <StatCard
            icon={<IconCalendarCheck size={22} />}
            color="psiGreen"
            value={confirmed.length}
            label="Consultas confirmadas"
            onClick={() => navigate('/psychologist/schedule')}
          />
          <StatCard
            icon={<IconClockHour4 size={22} />}
            color="psiTeal"
            value={upcoming.length}
            label="Próximos atendimentos"
            onClick={() => navigate('/psychologist/schedule')}
          />
          <StatCard
            icon={<IconUsers size={22} />}
            color="grape"
            value={linkedPatients.length}
            label="Pacientes vinculados"
          />
        </SimpleGrid>
      )}

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Próximos atendimentos */}
        <Box className="psi-card" p="lg">
          <Group justify="space-between" mb="md">
            <Text fw={700} fz={17}>
              Próximos atendimentos
            </Text>
            <Button
              size="xs"
              variant="subtle"
              color="psiGreen"
              rightSection={<IconChevronRight size={14} />}
              onClick={() => navigate('/psychologist/schedule')}
            >
              Ver agenda
            </Button>
          </Group>
          {upcoming.length === 0 ? (
            <EmptyHint text="Nenhuma consulta confirmada no momento." />
          ) : (
            <Stack gap="sm">
              {upcoming.slice(0, 4).map((a) => (
                <UpcomingRow key={a.id} a={a} />
              ))}
            </Stack>
          )}
        </Box>

        {/* Notificações internas */}
        <Box className="psi-card" p="lg">
          <Group justify="space-between" mb="md">
            <Group gap={8}>
              <Text fw={700} fz={17}>
                Notificações
              </Text>
              {unread > 0 && (
                <Badge color="red" variant="filled" radius="sm" size="sm">
                  {unread} nova{unread > 1 ? 's' : ''}
                </Badge>
              )}
            </Group>
            <Button
              size="xs"
              variant="subtle"
              color="psiGreen"
              rightSection={<IconChevronRight size={14} />}
              onClick={() => navigate('/psychologist/messages')}
            >
              Ver mensagens
            </Button>
          </Group>
          {!notifs || notifs.length === 0 ? (
            <EmptyHint text="Sem notificações por enquanto." />
          ) : (
            <Stack gap="sm">
              {notifs.slice(0, 4).map((n) => (
                <Group key={n.id} gap={12} wrap="nowrap" align="flex-start">
                  <ThemeIcon
                    variant="light"
                    color={n.read ? 'gray' : 'psiGreen'}
                    radius="xl"
                    size={36}
                  >
                    <IconBell size={18} />
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} fz={14}>
                      {n.title}
                    </Text>
                    <Text fz={13} c={palette.textSecondary}>
                      {n.message}
                    </Text>
                  </Box>
                </Group>
              ))}
            </Stack>
          )}
        </Box>
      </SimpleGrid>

      {/* Pacientes vinculados */}
      <Box className="psi-card" p="lg">
        <Group justify="space-between" mb="md">
          <Text fw={700} fz={17}>
            Pacientes vinculados
          </Text>
          <Badge variant="light" color="grape" radius="sm">
            {linkedPatients.length} ativos
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {linkedPatients.map((p) => (
            <Group key={p.id} gap={12} wrap="nowrap" className="psi-card" p="md">
              <Avatar src={p.avatar} radius="xl" size={48} />
              <Box style={{ flex: 1 }}>
                <Text fw={700} fz={14}>
                  {p.name}
                </Text>
                <Text fz={12} c={palette.textSecondary}>
                  {p.focus} • {p.sessions} sessões
                </Text>
              </Box>
            </Group>
          ))}
        </SimpleGrid>
      </Box>
    </PageSkeleton>
  );
}

function UpcomingRow({ a }: { a: PatientAppointment }) {
  const meta = statusMeta[a.status];
  return (
    <Group justify="space-between" wrap="nowrap" className="psi-card" p="sm">
      <Group gap={12} wrap="nowrap">
        <Avatar src={a.patientAvatar} radius="xl" size={40} />
        <Box>
          <Text fw={600} fz={14}>
            {a.patientName}
          </Text>
          <Text fz={12} c={palette.textSecondary}>
            {a.weekday}, {shortDate(a.date)} às {a.time} • {modalityLabel[a.modality]}
          </Text>
        </Box>
      </Group>
      <Badge color={meta.color} variant="light" radius="sm">
        {meta.label}
      </Badge>
    </Group>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <Box py={24} style={{ display: 'grid', placeItems: 'center' }}>
      <Text fz={13} c={palette.textSecondary}>
        {text}
      </Text>
    </Box>
  );
}
