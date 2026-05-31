import type { ReactNode } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import { palette } from '../../theme';

interface PageSkeletonProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function PageSkeleton({ title, subtitle, children }: PageSkeletonProps) {
  return (
    <Stack gap="xl">
      <Box>
        <Text fz={30} fw={800} lh={1.1}>
          {title}
        </Text>
        <Text fz={15} c={palette.textSecondary} mt={4}>
          {subtitle}
        </Text>
      </Box>

      {children ?? (
        <Box
          className="psi-card"
          p={40}
          style={{ display: 'grid', placeItems: 'center', minHeight: 320 }}
        >
          <Stack align="center" gap={8}>
            <Text fw={600} c={palette.textSecondary}>
              Em construção
            </Text>
            <Text fz={13} c={palette.textSecondary}>
              Esta tela será implementada nas próximas etapas.
            </Text>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
