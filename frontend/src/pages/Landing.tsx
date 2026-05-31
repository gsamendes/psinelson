import { Link } from 'react-router-dom';
import { Box, Button, Container, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconBrandMantine,
  IconCalendarHeart,
  IconDeviceLaptop,
  IconShieldHeart,
} from '@tabler/icons-react';
import { palette } from '../theme';

const features = [
  { icon: IconDeviceLaptop, title: 'Online ou presencial', desc: 'Atendimento como preferir.' },
  { icon: IconShieldHeart, title: 'Profissionais verificados', desc: 'Psicólogos com CRP ativo.' },
  { icon: IconCalendarHeart, title: 'Agenda simples', desc: 'Marque em poucos cliques.' },
];

export function Landing() {
  return (
    <Box style={{ minHeight: '100vh', background: palette.bg }}>
      <Group justify="space-between" px={40} h={76}>
        <Group gap={10}>
          <ThemeIcon size={40} radius={13} variant="gradient"
            gradient={{ from: 'psiGreen', to: 'psiTeal', deg: 135 }}>
            <IconBrandMantine size={22} />
          </ThemeIcon>
          <Text fw={800} fz={22} c={palette.greenDark}>
            PsiApp
          </Text>
        </Group>
        <Group gap={10}>
          <Button component={Link} to="/login" variant="subtle" color="psiGreen" radius="xl">
            Entrar
          </Button>
          <Button component={Link} to="/register" color="psiGreen" radius="xl">
            Criar conta
          </Button>
        </Group>
      </Group>

      <Container size="md" py={80}>
        <Stack align="center" gap="lg" ta="center">
          <Text fz={48} fw={800} lh={1.1}>
            Cuidar da mente é{' '}
            <Text span c={palette.green} inherit>
              cuidar de você
            </Text>
          </Text>
          <Text fz={18} c={palette.textSecondary} maw={560}>
            O PsiApp conecta pacientes e psicólogos para atendimento online ou
            presencial — com acolhimento, segurança e praticidade.
          </Text>
          <Group gap={12} mt="sm">
            <Button component={Link} to="/register" color="psiGreen" radius="xl" size="lg">
              Começar agora
            </Button>
            <Button component={Link} to="/login" variant="default" radius="xl" size="lg">
              Já tenho conta
            </Button>
          </Group>
        </Stack>

        <Group justify="center" gap="lg" mt={64} wrap="wrap">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Box key={f.title} className="psi-card" p="lg" w={240}>
                <ThemeIcon size={48} radius="md" variant="light" color="psiGreen" mb="sm">
                  <Icon size={24} />
                </ThemeIcon>
                <Text fw={700} fz={16}>
                  {f.title}
                </Text>
                <Text fz={13} c={palette.textSecondary}>
                  {f.desc}
                </Text>
              </Box>
            );
          })}
        </Group>
      </Container>
    </Box>
  );
}
