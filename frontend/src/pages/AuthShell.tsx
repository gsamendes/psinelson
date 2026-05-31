import type { ReactNode } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { IconBrandMantine } from '@tabler/icons-react';
import classes from './AuthShell.module.css';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <Box className={classes.wrap}>
      <Box className={classes.side}>
        <Group gap={10}>
          <Box className={classes.logoMark}>
            <IconBrandMantine size={22} />
          </Box>
          <Text fw={800} fz={24} c="#fff">
            PsiApp
          </Text>
        </Group>
        <Stack gap="sm" maw={360}>
          <Text fz={30} fw={800} c="#fff" lh={1.2}>
            Cuidar da mente é cuidar de você.
          </Text>
          <Text fz={15} c="rgba(255,255,255,0.85)">
            Conectamos pacientes e psicólogos para atendimento online ou
            presencial, com acolhimento e segurança.
          </Text>
        </Stack>
        <Text fz={12} c="rgba(255,255,255,0.7)">
          © 2026 PsiApp
        </Text>
      </Box>

      <Box className={classes.formArea}>
        <Box className={classes.card}>
          <Text fz={26} fw={800} mb={4}>
            {title}
          </Text>
          <Text fz={14} c="var(--psi-text-2)" mb="xl">
            {subtitle}
          </Text>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
