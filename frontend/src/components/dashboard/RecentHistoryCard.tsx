import { Avatar, Badge, Box, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconChevronRight, IconLungs } from '@tabler/icons-react';
import { recentHistory, psychologist } from '../../mocks/data';
import { palette } from '../../theme';

export function RecentHistoryCard() {
  return (
    <Box className="psi-card" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700} fz={16}>
          Histórico Recente
        </Text>
        <Group gap={2} style={{ cursor: 'pointer' }}>
          <Text fz={12} fw={500} c={palette.green}>
            Ver tudo
          </Text>
          <IconChevronRight size={14} color={palette.green} />
        </Group>
      </Group>

      <Stack gap={14}>
        {recentHistory.map((item) => (
          <Group key={item.id} justify="space-between" wrap="nowrap">
            <Group gap={12} wrap="nowrap">
              {item.kind === 'appointment' ? (
                <Avatar src={psychologist.avatar} size={40} radius="xl" />
              ) : (
                <ThemeIcon
                  size={40}
                  radius="xl"
                  variant="light"
                  color="psiTeal"
                >
                  <IconLungs size={20} stroke={1.8} />
                </ThemeIcon>
              )}
              <Box>
                <Text fz={13.5} fw={600} lh={1.25}>
                  {item.title}
                  {item.kind === 'appointment' ? ` ${item.subtitle}` : ''}
                </Text>
                <Text fz={12} c={palette.textSecondary}>
                  {item.date}
                </Text>
              </Box>
            </Group>
            <Badge
              radius="sm"
              variant="light"
              style={{ background: `${item.statusColor}1f`, color: item.statusColor }}
            >
              {item.status}
            </Badge>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}
