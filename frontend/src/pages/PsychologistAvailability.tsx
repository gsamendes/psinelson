import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalendarPlus,
  IconClock,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  useAddSlot,
  useRemoveSlot,
  useSlots,
  useUpdateSlot,
} from '../hooks/usePsychologistConsole';
import type { Modality, PsychologistSlot } from '../types';
import { palette } from '../theme';
import { modalityLabel, shortDate } from '../utils/display';

const TODAY = '2026-05-30';

function notifyError(err: unknown) {
  notifications.show({
    color: 'red',
    title: 'Não foi possível salvar',
    message: err instanceof Error ? err.message : 'Tente novamente em instantes.',
  });
}

export function PsychologistAvailability() {
  const { data: slots, isPending } = useSlots();
  const addSlot = useAddSlot();
  const removeSlot = useRemoveSlot();
  const updateSlot = useUpdateSlot();

  // formulário de novo horário
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [modality, setModality] = useState<Modality>('online');

  // edição
  const [editing, setEditing] = useState<PsychologistSlot | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  function handleAdd() {
    addSlot.mutate(
      { date, time, modality },
      {
        onSuccess: () => {
          notifications.show({
            color: 'psiGreen',
            title: 'Horário cadastrado',
            message: 'Novo horário disponível para os pacientes.',
          });
          setDate('');
          setTime('');
          setModality('online');
        },
        onError: notifyError,
      }
    );
  }

  function startEdit(slot: PsychologistSlot) {
    setEditing(slot);
    open();
  }

  function handleRemove(slot: PsychologistSlot) {
    removeSlot.mutate(slot.id, {
      onSuccess: () =>
        notifications.show({
          color: 'gray',
          title: 'Horário removido',
          message: `${slot.weekday}, ${shortDate(slot.date)} às ${slot.time} foi removido.`,
        }),
      onError: notifyError,
    });
  }

  return (
    <PageSkeleton
      title="Disponibilidade"
      subtitle="Cadastre, edite e remova seus horários de atendimento. Dados simulados — sem backend nesta fase."
    >
      {/* Formulário de novo horário */}
      <Box className="psi-card" p="lg">
        <Text fw={700} fz={16} mb="md">
          Novo horário
        </Text>
        <Group align="flex-end" gap="md" wrap="wrap">
          <TextInput
            label="Data"
            type="date"
            min={TODAY}
            value={date}
            onChange={(e) => setDate(e.currentTarget.value)}
            w={170}
          />
          <TextInput
            label="Hora"
            type="time"
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
            w={130}
          />
          <Box>
            <Text fz={14} fw={500} mb={6}>
              Modalidade
            </Text>
            <SegmentedControl
              value={modality}
              onChange={(v) => setModality(v as Modality)}
              data={[
                { label: 'Online', value: 'online' },
                { label: 'Presencial', value: 'presencial' },
                { label: 'Híbrido', value: 'hibrido' },
              ]}
            />
          </Box>
          <Button
            color="psiGreen"
            radius="xl"
            leftSection={<IconCalendarPlus size={18} />}
            loading={addSlot.isPending}
            disabled={!date || !time}
            onClick={handleAdd}
          >
            Adicionar
          </Button>
        </Group>
      </Box>

      {/* Lista de horários */}
      <Box>
        <Text fw={700} fz={16} mb="md">
          Horários cadastrados
        </Text>
        {isPending ? (
          <Stack gap="sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={68} radius={18} />
            ))}
          </Stack>
        ) : !slots || slots.length === 0 ? (
          <EmptyState
            icon={IconClock}
            title="Nenhum horário cadastrado"
            description="Adicione horários acima para começar a receber solicitações."
          />
        ) : (
          <Stack gap="sm">
            {slots.map((s) => (
              <Group
                key={s.id}
                justify="space-between"
                wrap="nowrap"
                className="psi-card"
                p="md"
              >
                <Group gap={14} wrap="nowrap">
                  <IconClock size={22} color={palette.green} />
                  <Box>
                    <Text fw={700} fz={15}>
                      {s.weekday}, {shortDate(s.date)} às {s.time}
                    </Text>
                    <Badge variant="light" color="psiTeal" radius="sm" mt={4}>
                      {modalityLabel[s.modality]}
                    </Badge>
                  </Box>
                </Group>
                <Group gap={6}>
                  <ActionIcon
                    variant="subtle"
                    color="psiGreen"
                    size="lg"
                    onClick={() => startEdit(s)}
                  >
                    <IconPencil size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="lg"
                    loading={removeSlot.isPending}
                    onClick={() => handleRemove(s)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            ))}
          </Stack>
        )}
      </Box>

      {/* Modal de edição */}
      <Modal opened={opened} onClose={close} title="Editar horário" radius="lg" centered>
        {editing && (
          <EditForm
            slot={editing}
            saving={updateSlot.isPending}
            onSave={(input) =>
              updateSlot.mutate(
                { id: editing.id, input },
                {
                  onSuccess: () => {
                    notifications.show({
                      color: 'psiGreen',
                      title: 'Horário atualizado',
                      message: 'As alterações foram salvas.',
                    });
                    close();
                  },
                  onError: notifyError,
                }
              )
            }
          />
        )}
      </Modal>
    </PageSkeleton>
  );
}

function EditForm({
  slot,
  saving,
  onSave,
}: {
  slot: PsychologistSlot;
  saving: boolean;
  onSave: (input: { date: string; time: string; modality: Modality }) => void;
}) {
  const [date, setDate] = useState(slot.date);
  const [time, setTime] = useState(slot.time);
  const [modality, setModality] = useState<Modality>(slot.modality);

  return (
    <Stack gap="md">
      <TextInput
        label="Data"
        type="date"
        min={TODAY}
        value={date}
        onChange={(e) => setDate(e.currentTarget.value)}
      />
      <TextInput
        label="Hora"
        type="time"
        value={time}
        onChange={(e) => setTime(e.currentTarget.value)}
      />
      <Box>
        <Text fz={14} fw={500} mb={6}>
          Modalidade
        </Text>
        <SegmentedControl
          fullWidth
          value={modality}
          onChange={(v) => setModality(v as Modality)}
          data={[
            { label: 'Online', value: 'online' },
            { label: 'Presencial', value: 'presencial' },
            { label: 'Híbrido', value: 'hibrido' },
          ]}
        />
      </Box>
      <Button
        color="psiGreen"
        radius="xl"
        loading={saving}
        disabled={!date || !time}
        onClick={() => onSave({ date, time, modality })}
      >
        Salvar alterações
      </Button>
    </Stack>
  );
}
