import { Avatar, Badge, Box, Button, Group, Text } from '@mantine/core';
import { IconCalendar, IconClock, IconVideo } from '@tabler/icons-react';
import { nextAppointment } from '../../mocks/data';
import { palette } from '../../theme';

export function AppointmentCard() {
  const appt = nextAppointment;

  return (
    <Box className="psi-card" p="lg" h="100%">
      <Group justify="space-between" mb="lg">
        <Text fw={700} fz={16}>
          Próxima Consulta
        </Text>
        <Badge color="psiGreen" variant="light" radius="sm" size="lg">
          {appt.modality}
        </Badge>
      </Group>

      <Group gap={14} mb="lg" wrap="nowrap">
        <Avatar src={appt.psychologist.avatar} size={56} radius="xl" />
        <Box>
          <Text fw={700} fz={16}>
            {appt.psychologist.name}
          </Text>
          <Text fz={13} c={palette.textSecondary}>
            {appt.psychologist.approach}
          </Text>
        </Box>
      </Group>

      <Group gap={20} mb="xl">
        <Group gap={8}>
          <IconCalendar size={18} color={palette.green} />
          <Text fz={14} fw={500}>
            {appt.date}
          </Text>
        </Group>
        <Group gap={8}>
          <IconClock size={18} color={palette.green} />
          <Text fz={14} fw={500}>
            {appt.time}
          </Text>
        </Group>
      </Group>

      <Group grow gap={12}>
        <Button variant="default" radius="xl" size="md">
          Ver Detalhes
        </Button>
        <Button
          radius="xl"
          size="md"
          color="psiGreen"
          leftSection={<IconVideo size={18} />}
        >
          Entrar na Sala
        </Button>
      </Group>
    </Box>
  );
}
