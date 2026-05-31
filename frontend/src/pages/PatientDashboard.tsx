import { Box, Button, Grid, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconCalendarPlus, IconCalendar, IconSearch } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { MoodSelector } from '../components/dashboard/MoodSelector';
import { AppointmentCard } from '../components/dashboard/AppointmentCard';
import { WellnessChartCard } from '../components/dashboard/WellnessChartCard';
import { PsychologistCard } from '../components/dashboard/PsychologistCard';
import { QuickAccessCard } from '../components/dashboard/QuickAccessCard';
import { SelfCareJourneyCard } from '../components/dashboard/SelfCareJourneyCard';
import { GoalsCard } from '../components/dashboard/GoalsCard';
import { RecentHistoryCard } from '../components/dashboard/RecentHistoryCard';
import { FindPsychologistBanner } from '../components/dashboard/FindPsychologistBanner';
import { SupportBar } from '../components/dashboard/SupportBar';
import { useAuthStore } from '../stores/authStore';
import { palette } from '../theme';

export function PatientDashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name.split(' ')[0] ?? 'Camila';

  return (
    <Stack gap="xl">
      {/* Greeting header */}
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box>
          <Text fz={34} fw={800} lh={1.1}>
            Olá, <Text span c={palette.green} inherit>{firstName}</Text>
          </Text>
          <Text fz={15} c={palette.textSecondary} mt={4}>
            Como você está se sentindo hoje?
          </Text>
        </Box>

        <Group gap={12}>
          <Button
            color="psiGreen"
            radius="xl"
            size="md"
            leftSection={<IconCalendarPlus size={18} />}
          >
            Agendar Nova Consulta
          </Button>
          <Group
            gap={8}
            px={16}
            h={44}
            style={{
              background: '#fff',
              border: `1px solid ${palette.border}`,
              borderRadius: 999,
            }}
          >
            <IconCalendar size={18} color={palette.green} />
            <Text fz={14} fw={500}>
              Sáb. 13 Ago
            </Text>
          </Group>
          <ActionIcon variant="white" radius="xl" size={44} color="gray">
            <IconSearch size={18} />
          </ActionIcon>
        </Group>
      </Group>

      <MoodSelector />

      {/* Top grid */}
      <Grid gutter="lg" align="stretch">
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <AppointmentCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 5 }}>
          <WellnessChartCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            <PsychologistCard />
            <QuickAccessCard />
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Bottom grid */}
      <Grid gutter="lg" align="stretch">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" h="100%">
            <SelfCareJourneyCard />
            <GoalsCard />
            <RecentHistoryCard />
          </SimpleGrid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <FindPsychologistBanner />
        </Grid.Col>
      </Grid>

      <SupportBar />
    </Stack>
  );
}
