import { Box, Button, Group, Text, ThemeIcon } from '@mantine/core';
import { IconArrowRight, IconHeadset } from '@tabler/icons-react';
import { palette } from '../../theme';

export function SupportBar() {
  return (
    <Box
      className="psi-card"
      p="md"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Group gap={16} wrap="nowrap">
        <ThemeIcon size={52} radius="xl" variant="light" color="psiGreen">
          <IconHeadset size={26} stroke={1.7} />
        </ThemeIcon>
        <Box>
          <Text fw={700} fz={15}>
            Precisa de ajuda agora?
          </Text>
          <Text fz={13} c={palette.textSecondary}>
            Converse com um psicólogo disponível
          </Text>
        </Box>
      </Group>
      <Button
        color="psiGreen"
        radius="xl"
        size="md"
        rightSection={<IconArrowRight size={18} />}
      >
        Ver Psicólogos Online
      </Button>
    </Box>
  );
}
