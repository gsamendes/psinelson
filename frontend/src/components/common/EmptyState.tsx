import type { ReactNode } from 'react';
import { Box, Button, Stack, Text } from '@mantine/core';
import type { Icon } from '@tabler/icons-react';
import { palette } from '../../theme';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
}

/** Estado vazio padrão (card centralizado com ícone, texto e ação opcional). */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Box className="psi-card" p={48} style={{ display: 'grid', placeItems: 'center' }}>
      <Stack align="center" gap={8} maw={440}>
        <Icon size={44} stroke={1.6} color={palette.textSecondary} />
        <Text fw={600}>{title}</Text>
        {description && (
          <Text fz={13} c={palette.textSecondary} ta="center">
            {description}
          </Text>
        )}
        {action && (
          <Button
            mt={6}
            variant="light"
            color="psiGreen"
            radius="xl"
            leftSection={action.icon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
