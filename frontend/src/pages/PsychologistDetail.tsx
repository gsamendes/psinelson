import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendarPlus,
  IconMapPin,
  IconStarFilled,
} from '@tabler/icons-react';
import { usePsychologist } from '../hooks/usePsychologists';
import { useCreateAppointment } from '../hooks/useAppointments';
import type { AvailableSlot } from '../types';
import { palette } from '../theme';
import { modalityLabel, priceRangeLabel, shortDate } from '../utils/display';

export function PsychologistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: p, isPending, isError, refetch } = usePsychologist(id);
  const createAppointment = useCreateAppointment();

  const [selected, setSelected] = useState<AvailableSlot | null>(null);
  const [confirmOpen, { open, close }] = useDisclosure(false);

  if (isError) {
    return (
      <Stack gap="lg">
        <BackButton onClick={() => navigate('/patient/search')} />
        <Alert
          color="red"
          radius="md"
          icon={<IconAlertTriangle size={18} />}
          title="Psicólogo não encontrado"
        >
          <Group justify="space-between">
            <Text fz={14}>Não foi possível carregar este perfil.</Text>
            <Button size="xs" variant="white" color="red" onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </Group>
        </Alert>
      </Stack>
    );
  }

  if (isPending) {
    return (
      <Stack gap="lg">
        <BackButton onClick={() => navigate('/patient/search')} />
        <Skeleton height={180} radius={22} />
        <Skeleton height={140} radius={22} />
      </Stack>
    );
  }

  function handleConfirm() {
    if (!selected || !p) return;
    createAppointment.mutate(
      {
        psychologist: {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          specialty: p.specialty,
          modality: p.modality,
        },
        slot: selected,
      },
      {
        onSuccess: () => {
          close();
          setSelected(null);
          notifications.show({
            color: 'psiGreen',
            title: 'Solicitação enviada',
            message:
              'Sua consulta ficou PENDENTE até o aceite do psicólogo. Acompanhe em Minhas Consultas.',
          });
          navigate('/patient/appointments');
        },
        onError: (err) => {
          close();
          notifications.show({
            color: 'red',
            title: 'Não foi possível solicitar',
            message:
              err instanceof Error ? err.message : 'Tente novamente em instantes.',
          });
        },
      }
    );
  }

  return (
    <Stack gap="lg">
      <BackButton onClick={() => navigate('/patient/search')} />

      {/* Cabeçalho do perfil */}
      <Box className="psi-card" p="xl">
        <Group gap="xl" wrap="nowrap" align="flex-start">
          <Avatar src={p.avatar} size={96} radius="xl" />
          <Stack gap={6} style={{ flex: 1 }}>
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text fw={800} fz={24}>
                  {p.name}
                </Text>
                <Text fz={13} c={palette.textSecondary}>
                  {p.crp} • {p.approach}
                </Text>
              </Box>
              <Group gap={6}>
                <IconStarFilled size={16} color="#E2B33C" />
                <Text fw={700}>{p.rating.toFixed(1).replace('.', ',')}</Text>
                <Text fz={13} c={palette.textSecondary}>
                  ({p.reviews})
                </Text>
              </Group>
            </Group>

            <Group gap={8} mt={4}>
              <Badge color="psiGreen" variant="light" radius="sm">
                {p.specialty}
              </Badge>
              <Badge color="psiTeal" variant="light" radius="sm">
                {modalityLabel[p.modality]}
              </Badge>
            </Group>

            <Group gap={20} mt={6} c={palette.textSecondary}>
              <Group gap={6}>
                <IconMapPin size={16} />
                <Text fz={13}>{p.location}</Text>
              </Group>
              <Text fz={13} fw={600} c={palette.greenDark}>
                {priceRangeLabel(p.priceMin, p.priceMax)} / sessão
              </Text>
            </Group>
          </Stack>
        </Group>

        <Divider my="lg" color={palette.border} />
        <Text fw={700} fz={15} mb={6}>
          Sobre
        </Text>
        <Text fz={14} c={palette.textSecondary}>
          {p.description}
        </Text>
      </Box>

      {/* Seleção de horário */}
      <Box className="psi-card" p="xl">
        <Text fw={700} fz={16} mb={4}>
          Horários disponíveis
        </Text>
        <Text fz={13} c={palette.textSecondary} mb="lg">
          Selecione um horário para solicitar a consulta. O agendamento fica{' '}
          <b>pendente</b> até o aceite do psicólogo.
        </Text>

        {p.availableSlots.length === 0 ? (
          <Alert color="gray" radius="md" variant="light">
            Este profissional não possui horários disponíveis no momento.
          </Alert>
        ) : (
          <>
            <Group gap={10}>
              {p.availableSlots.map((s) => (
                <Chip
                  key={s.id}
                  checked={selected?.id === s.id}
                  onChange={() => setSelected(s)}
                  color="psiGreen"
                  variant="outline"
                  radius="md"
                >
                  {s.weekday} {shortDate(s.date)} • {s.time}
                </Chip>
              ))}
            </Group>

            <Button
              mt="xl"
              radius="xl"
              color="psiGreen"
              leftSection={<IconCalendarPlus size={18} />}
              disabled={!selected}
              onClick={open}
            >
              Solicitar consulta
            </Button>
          </>
        )}
      </Box>

      {/* Confirmação */}
      <Modal
        opened={confirmOpen}
        onClose={close}
        title="Confirmar solicitação"
        radius="lg"
        centered
      >
        {selected && (
          <Stack gap="sm">
            <Text fz={14}>
              Você está solicitando uma consulta com <b>{p.name}</b>.
            </Text>
            <Box
              p="md"
              style={{
                background: palette.bg,
                borderRadius: 14,
                border: `1px solid ${palette.border}`,
              }}
            >
              <Text fz={14}>
                {selected.weekday}, {shortDate(selected.date)} às {selected.time}
              </Text>
              <Text fz={13} c={palette.textSecondary}>
                {modalityLabel[p.modality]} • {p.specialty}
              </Text>
            </Box>
            <Alert color="yellow" variant="light" radius="md">
              A consulta será criada com status <b>PENDENTE</b> e só é confirmada
              após o aceite do psicólogo.
            </Alert>
            <Group justify="flex-end" mt="sm">
              <Button variant="default" radius="xl" onClick={close}>
                Voltar
              </Button>
              <Button
                color="psiGreen"
                radius="xl"
                loading={createAppointment.isPending}
                onClick={handleConfirm}
              >
                Confirmar solicitação
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="subtle"
      color="gray"
      radius="xl"
      w="fit-content"
      px={10}
      leftSection={<IconArrowLeft size={16} />}
      onClick={onClick}
    >
      Voltar à busca
    </Button>
  );
}
