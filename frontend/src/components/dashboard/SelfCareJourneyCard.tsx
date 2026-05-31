import { Box, Button, RingProgress, Stack, Text } from '@mantine/core';
import { selfCare } from '../../mocks/data';
import { palette } from '../../theme';

export function SelfCareJourneyCard() {
  const pct = (selfCare.current / selfCare.total) * 100;

  return (
    <Box className="psi-card" p="lg" h="100%">
      <Text fw={700} fz={16} mb="md">
        Jornada de Autocuidado
      </Text>

      <Stack align="center" gap={6}>
        <RingProgress
          size={132}
          thickness={11}
          roundCaps
          sections={[{ value: pct, color: 'psiGreen' }]}
          label={
            <Box ta="center">
              <Text fw={800} fz={30} c={palette.greenDark} lh={1}>
                {selfCare.current}
              </Text>
              <Text fz={12} c={palette.textSecondary}>
                de {selfCare.total}
              </Text>
            </Box>
          }
        />
        <Text fw={700} fz={15} mt={4}>
          {selfCare.message}
        </Text>
        <Text fz={12} c={palette.textSecondary} ta="center" px="sm">
          {selfCare.hint}
        </Text>
        <Button variant="light" color="psiGreen" radius="xl" mt="sm" fullWidth>
          Ver Atividades
        </Button>
      </Stack>
    </Box>
  );
}
