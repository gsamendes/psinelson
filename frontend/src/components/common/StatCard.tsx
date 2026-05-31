import type { ReactNode } from 'react';
import { Box, Group, Text, ThemeIcon } from '@mantine/core';
import { palette } from '../../theme';

interface StatCardProps {
  icon: ReactNode;
  color: string;
  value: number | string;
  label: string;
  onClick?: () => void;
}

/** Card de indicador (número + rótulo + ícone). Opcionalmente clicável. */
export function StatCard({ icon, color, value, label, onClick }: StatCardProps) {
  return (
    <Box
      className="psi-card"
      p="lg"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box>
          <Text fz={34} fw={800} lh={1}>
            {value}
          </Text>
          <Text fz={13} c={palette.textSecondary} mt={6}>
            {label}
          </Text>
        </Box>
        <ThemeIcon variant="light" color={color} radius="xl" size={48}>
          {icon}
        </ThemeIcon>
      </Group>
    </Box>
  );
}
