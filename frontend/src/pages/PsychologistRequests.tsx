import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconInbox, IconX } from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import {
  useAcceptAppointment,
  usePsychologistAppointments,
  useRejectAppointment,
} from '../hooks/usePsychologistConsole';
import type { PatientAppointment } from '../types';
import { palette } from '../theme';
import { modalityLabel, shortDate } from '../utils/display';

export function PsychologistRequests() {
  const { data, isPending, isError, refetch } = usePsychologistAppointments();
  const pending = data?.filter((a) => a.status === 'PENDENTE') ?? [];

  return (
    <PageSkeleton
      title="Solicitações"
      subtitle="Analise os pedidos de consulta. Ao aceitar, a consulta vira CONFIRMADA; ao recusar, RECUSADA. O paciente recebe uma notificação simulada."
    >
      {isError ? (
        <ErrorState
          message="Ocorreu um erro ao carregar as solicitações."
          onRetry={() => refetch()}
        />
      ) : isPending ? (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={104} radius={22} />
          ))}
        </Stack>
      ) : pending.length === 0 ? (
        <EmptyState
          icon={IconInbox}
          title="Sem solicitações pendentes"
          description="Quando um paciente solicitar um horário, ele aparecerá aqui."
        />
      ) : (
        <Stack gap="md">
          {pending.map((a) => (
            <RequestRow key={a.id} a={a} />
          ))}
        </Stack>
      )}
    </PageSkeleton>
  );
}

function RequestRow({ a }: { a: PatientAppointment }) {
  const accept = useAcceptAppointment();
  const reject = useRejectAppointment();
  const busy = accept.isPending || reject.isPending;

  function handleAccept() {
    accept.mutate(a.id, {
      onSuccess: () =>
        notifications.show({
          color: 'psiGreen',
          title: 'Solicitação aceita',
          message: `Consulta com ${a.patientName} confirmada. Paciente notificado.`,
        }),
      onError: (err) =>
        notifications.show({
          color: 'red',
          title: 'Não foi possível aceitar',
          message: err instanceof Error ? err.message : 'Tente novamente.',
        }),
    });
  }

  function handleReject() {
    reject.mutate(a.id, {
      onSuccess: () =>
        notifications.show({
          color: 'gray',
          title: 'Solicitação recusada',
          message: `Consulta com ${a.patientName} recusada. Paciente notificado.`,
        }),
      onError: (err) =>
        notifications.show({
          color: 'red',
          title: 'Não foi possível recusar',
          message: err instanceof Error ? err.message : 'Tente novamente.',
        }),
    });
  }

  return (
    <Box className="psi-card" p="lg">
      <Group justify="space-between" wrap="nowrap" align="center">
        <Group gap={14} wrap="nowrap">
          <Avatar src={a.patientAvatar} size={52} radius="xl" />
          <Box>
            <Text fw={700} fz={15}>
              {a.patientName}
            </Text>
            <Text fz={13} c={palette.textSecondary}>
              {a.weekday}, {shortDate(a.date)} às {a.time} • {modalityLabel[a.modality]}
            </Text>
            <Badge variant="light" color="yellow" radius="sm" mt={6}>
              {a.specialty}
            </Badge>
          </Box>
        </Group>

        <Group gap={8} wrap="nowrap">
          <Button
            variant="light"
            color="red"
            radius="xl"
            leftSection={<IconX size={16} />}
            loading={reject.isPending}
            disabled={busy}
            onClick={handleReject}
          >
            Recusar
          </Button>
          <Button
            color="psiGreen"
            radius="xl"
            leftSection={<IconCheck size={16} />}
            loading={accept.isPending}
            disabled={busy}
            onClick={handleAccept}
          >
            Aceitar
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
