import { Box, Button, Group, Stack, Text } from '@mantine/core';
import {
  IconCircleCheck,
  IconDeviceLaptop,
  IconHeartHandshake,
  IconStarFilled,
} from '@tabler/icons-react';
import classes from './FindPsychologistBanner.module.css';

const benefits = [
  { icon: IconDeviceLaptop, label: 'Atendimento online ou presencial' },
  { icon: IconHeartHandshake, label: 'Diversas abordagens terapêuticas' },
  { icon: IconStarFilled, label: 'Avaliações reais de pacientes' },
];

export function FindPsychologistBanner() {
  return (
    <Box className={classes.banner}>
      <Box className={classes.content}>
        <Text fz={14} fw={600} c="var(--psi-green-dark)">
          Encontre o psicólogo ideal para você
        </Text>
        <Text fw={800} fz={22} lh={1.2} mt={6} mb="md">
          Mais de 2.000 profissionais qualificados te esperam
        </Text>

        <Stack gap={10} mb="lg">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <Group key={b.label} gap={10} wrap="nowrap">
                <Icon size={17} color="#5F7F62" />
                <Text fz={13} c="var(--psi-text-2)">
                  {b.label}
                </Text>
              </Group>
            );
          })}
        </Stack>

        <Button
          color="psiGreen"
          radius="xl"
          size="md"
          leftSection={<IconCircleCheck size={18} />}
        >
          Encontrar Psicólogo
        </Button>
      </Box>

      {/* decorative armchair + plant illustration (pure CSS/SVG) */}
      <Box className={classes.art} aria-hidden>
        <svg viewBox="0 0 160 170" width="100%" height="100%">
          {/* plant */}
          <g transform="translate(112,70)">
            <path d="M18 60c0-22 8-40 8-40" fill="none" stroke="#6E9E72" strokeWidth="3" />
            <path d="M26 26c-10-4-20 2-22 12 12 3 20-3 22-12z" fill="#7FB069" />
            <path d="M26 30c10-6 22-2 26 8-12 5-22 1-26-8z" fill="#5F9E6E" />
            <path d="M26 44c-8-2-16 3-17 11 10 2 16-4 17-11z" fill="#8FBF85" />
            <path d="M14 60h26l-3 22a4 4 0 0 1-4 3H21a4 4 0 0 1-4-3z" fill="#D9A066" />
          </g>
          {/* armchair */}
          <g transform="translate(8,52)">
            <rect x="6" y="34" width="78" height="46" rx="16" fill="#5F8F73" />
            <rect x="0" y="40" width="20" height="40" rx="10" fill="#4F7E63" />
            <rect x="70" y="40" width="20" height="40" rx="10" fill="#4F7E63" />
            <rect x="16" y="22" width="58" height="40" rx="18" fill="#6E9E82" />
            <rect x="20" y="78" width="10" height="20" rx="4" fill="#3F6B52" />
            <rect x="60" y="78" width="10" height="20" rx="4" fill="#3F6B52" />
          </g>
        </svg>
      </Box>
    </Box>
  );
}
