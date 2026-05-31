import { Box, Group, Progress, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconHeartbeat,
  IconMoon,
  IconSparkles,
  IconChevronRight,
} from '@tabler/icons-react';
import { goals } from '../../mocks/data';
import { palette } from '../../theme';

const icons = [IconHeartbeat, IconMoon, IconSparkles];

export function GoalsCard() {
  return (
    <Box className="psi-card" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700} fz={16}>
          Seus Objetivos
        </Text>
        <Group gap={2} style={{ cursor: 'pointer' }}>
          <Text fz={12} fw={500} c={palette.green}>
            Ver todos
          </Text>
          <IconChevronRight size={14} color={palette.green} />
        </Group>
      </Group>

      <Stack gap="lg">
        {goals.map((goal, i) => {
          const Icon = icons[i];
          return (
            <Box key={goal.id}>
              <Group justify="space-between" mb={8} wrap="nowrap">
                <Group gap={10} wrap="nowrap">
                  <ThemeIcon
                    variant="light"
                    radius="md"
                    size={34}
                    style={{ background: `${goal.color}1f`, color: goal.color }}
                  >
                    <Icon size={18} stroke={1.8} />
                  </ThemeIcon>
                  <Text fz={14} fw={500}>
                    {goal.label}
                  </Text>
                </Group>
                <Text fz={13} fw={700} c={goal.color}>
                  {goal.progress}%
                </Text>
              </Group>
              <Progress
                value={goal.progress}
                radius="xl"
                size="md"
                color={goal.color}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
