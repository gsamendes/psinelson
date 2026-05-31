import { Avatar, Box, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconMapPin,
  IconMessage,
  IconStarFilled,
  IconStar,
  IconUser,
} from '@tabler/icons-react';
import { psychologist } from '../../mocks/data';
import { modalityLabel } from '../../utils/display';
import classes from './PsychologistCard.module.css';

export function PsychologistCard() {
  const p = psychologist;

  return (
    <Box className={classes.card}>
      <Text fw={700} fz={16} c="rgba(255,255,255,0.92)" mb="md">
        Meu Psicólogo
      </Text>

      <Group gap={16} wrap="nowrap" mb="lg">
        <Avatar src={p.avatar} size={72} radius="xl" className={classes.avatar} />
        <Box>
          <Text fw={700} fz={20} c="#fff">
            {p.name}
          </Text>
          <Text fz={13} c="rgba(255,255,255,0.78)">
            {p.crp}
          </Text>
        </Box>
      </Group>

      <Stack gap={10} mb="xl">
        <Group gap={8}>
          <IconStarFilled size={16} color="#F2C84B" />
          <Text fz={13} c="rgba(255,255,255,0.9)">
            {p.rating.toFixed(1).replace('.', ',')} ({p.reviews} avaliações)
          </Text>
        </Group>
        <Group gap={8}>
          <Box className={classes.dot} />
          <Text fz={13} c="rgba(255,255,255,0.9)">
            TCC • {modalityLabel[p.modality]}
          </Text>
        </Group>
        <Group gap={8}>
          <IconMapPin size={16} color="rgba(255,255,255,0.85)" />
          <Text fz={13} c="rgba(255,255,255,0.9)">
            {p.location}
          </Text>
        </Group>
      </Stack>

      <Group grow gap={10}>
        <UnstyledButton className={classes.action}>
          <IconMessage size={20} />
          <Text fz={11}>Enviar Mensagem</Text>
        </UnstyledButton>
        <UnstyledButton className={classes.action}>
          <IconUser size={20} />
          <Text fz={11}>Ver Perfil</Text>
        </UnstyledButton>
        <UnstyledButton className={classes.action}>
          <IconStar size={20} />
          <Text fz={11}>Avaliar Consulta</Text>
        </UnstyledButton>
      </Group>
    </Box>
  );
}
