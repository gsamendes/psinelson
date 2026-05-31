import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Group,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconCalendarOff } from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { usePsychologistAppointments } from '../hooks/usePsychologistConsole';
import type { AppointmentStatus, PatientAppointment } from '../types';
import { palette } from '../theme';
import { modalityLabel, shortDate, statusMeta } from '../utils/display';

type Filter = 'all' | 'PENDENTE' | 'CONFIRMADA' | 'REALIZADA';

export function PsychologistSchedule() {
  const { data, isPending } = usePsychologistAppointments();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const items = data ?? [];
    const visible = filter === 'all' ? items : items.filter((a) => a.status === filter);
    return [...visible].sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
    );
  }, [data, filter]);

  // agrupa por data
  const groups = useMemo(() => {
    const map = new Map<string, PatientAppointment[]>();
    filtered.forEach((a) => {
      const list = map.get(a.date) ?? [];
      list.push(a);
      map.set(a.date, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <PageSkeleton
      title="Minha Agenda"
      subtitle="Suas consultas organizadas por data, com status visual. Dados simulados."
    >
      <SegmentedControl
        value={filter}
        onChange={(v) => setFilter(v as Filter)}
        data={[
          { label: 'Todas', value: 'all' },
          { label: 'Pendentes', value: 'PENDENTE' },
          { label: 'Confirmadas', value: 'CONFIRMADA' },
          { label: 'Realizadas', value: 'REALIZADA' },
        ]}
      />

      {isPending ? (
        <Stack gap="md">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={88} radius={22} />
          ))}
        </Stack>
      ) : groups.length === 0 ? (
        <EmptyState
          icon={IconCalendarOff}
          title="Nada na agenda"
          description="Não há consultas nesta categoria."
        />
      ) : (
        <Stack gap="xl">
          {groups.map(([date, items]) => (
            <Box key={date}>
              <Text fw={700} fz={14} c={palette.textSecondary} mb="sm">
                {items[0].weekday}, {shortDate(date)}
              </Text>
              <Stack gap="sm">
                {items.map((a) => (
                  <ScheduleRow key={a.id} a={a} />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </PageSkeleton>
  );
}

const STATUS_BAR: Record<AppointmentStatus, string> = {
  PENDENTE: '#E2B33C',
  CONFIRMADA: '#5F8F66',
  RECUSADA: '#D9694C',
  CANCELADA: '#9b9b9b',
  REALIZADA: '#388286',
};

function ScheduleRow({ a }: { a: PatientAppointment }) {
  const meta = statusMeta[a.status];
  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      className="psi-card"
      p="md"
      style={{ borderLeft: `4px solid ${STATUS_BAR[a.status]}` }}
    >
      <Group gap={14} wrap="nowrap">
        <Text fw={800} fz={16} w={56}>
          {a.time}
        </Text>
        <Avatar src={a.patientAvatar} size={44} radius="xl" />
        <Box>
          <Text fw={700} fz={14}>
            {a.patientName}
          </Text>
          <Text fz={12} c={palette.textSecondary}>
            {a.specialty} • {modalityLabel[a.modality]}
          </Text>
        </Box>
      </Group>
      <Badge color={meta.color} variant="light" radius="sm" size="lg">
        {meta.label}
      </Badge>
    </Group>
  );
}
