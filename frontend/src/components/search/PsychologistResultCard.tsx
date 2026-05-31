import { Avatar, Badge, Box, Button, Group, Stack, Text } from '@mantine/core';
import { IconMapPin, IconStarFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import type { Psychologist } from '../../types';
import { palette } from '../../theme';
import { modalityLabel, priceRangeLabel } from '../../utils/display';

export function PsychologistResultCard({ p }: { p: Psychologist }) {
  const navigate = useNavigate();
  const hasSlots = p.availableSlots.length > 0;

  return (
    <Box className="psi-card" p="lg" h="100%">
      <Stack gap="md" h="100%">
        <Group gap={14} wrap="nowrap" align="flex-start">
          <Avatar src={p.avatar} size={64} radius="xl" />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={700} fz={17} lineClamp={1}>
              {p.name}
            </Text>
            <Text fz={12} c={palette.textSecondary}>
              {p.crp}
            </Text>
            <Group gap={6} mt={6}>
              <IconStarFilled size={14} color="#E2B33C" />
              <Text fz={12} fw={600}>
                {p.rating.toFixed(1).replace('.', ',')}
              </Text>
              <Text fz={12} c={palette.textSecondary}>
                ({p.reviews})
              </Text>
            </Group>
          </Box>
        </Group>

        <Group gap={8}>
          <Badge color="psiGreen" variant="light" radius="sm">
            {p.specialty}
          </Badge>
          <Badge color="psiTeal" variant="light" radius="sm">
            {modalityLabel[p.modality]}
          </Badge>
        </Group>

        <Group gap={6} c={palette.textSecondary}>
          <IconMapPin size={15} />
          <Text fz={13}>{p.location}</Text>
        </Group>

        <Text fz={13} c={palette.textSecondary} lineClamp={2} style={{ flex: 1 }}>
          {p.description}
        </Text>

        <Group justify="space-between" align="center">
          <Text fw={700} fz={15} c={palette.greenDark}>
            {priceRangeLabel(p.priceMin, p.priceMax)}
          </Text>
          <Text fz={11} c={hasSlots ? palette.green : palette.textSecondary}>
            {hasSlots
              ? `${p.availableSlots.length} horários`
              : 'Sem horários'}
          </Text>
        </Group>

        <Button
          radius="xl"
          color="psiGreen"
          fullWidth
          onClick={() => navigate(`/patient/psychologist/${p.id}`)}
        >
          Ver perfil
        </Button>
      </Stack>
    </Box>
  );
}
