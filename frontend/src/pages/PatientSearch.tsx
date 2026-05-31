import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { IconFilterOff, IconMoodEmpty } from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { PsychologistResultCard } from '../components/search/PsychologistResultCard';
import { usePsychologists } from '../hooks/usePsychologists';
import {
  locationOptions,
  maxPriceCap,
  specialtyOptions,
  weekdayOptions,
} from '../mocks/data';
import type { PsychologistFilters } from '../types';
import { palette } from '../theme';

const initialFilters: PsychologistFilters = {
  specialty: '',
  modality: 'all',
  location: '',
  weekday: '',
  maxPrice: maxPriceCap,
};

export function PatientSearch() {
  const [filters, setFilters] = useState<PsychologistFilters>(initialFilters);
  const { data, isPending, isError, refetch } = usePsychologists(filters);

  const isFiltered = useMemo(
    () =>
      filters.specialty !== '' ||
      filters.modality !== 'all' ||
      filters.location !== '' ||
      filters.weekday !== '' ||
      filters.maxPrice !== maxPriceCap,
    [filters]
  );

  function set<K extends keyof PsychologistFilters>(
    key: K,
    value: PsychologistFilters[K]
  ) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <PageSkeleton
      title="Encontrar Psicólogos"
      subtitle="Busque profissionais por especialidade, modalidade, disponibilidade, localização e faixa de valor."
    >
      <Stack gap="xl">
        {/* Filtros permitidos — nenhum critério sensível/discriminatório. */}
        <Box className="psi-card" p="lg">
          <Grid gutter="md" align="flex-end">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Especialidade"
                placeholder="Todas"
                data={specialtyOptions}
                value={filters.specialty || null}
                onChange={(v) => set('specialty', v ?? '')}
                clearable
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Modalidade"
                data={[
                  { value: 'all', label: 'Todas' },
                  { value: 'online', label: 'Online' },
                  { value: 'presencial', label: 'Presencial' },
                  { value: 'hibrido', label: 'Híbrido' },
                ]}
                value={filters.modality}
                onChange={(v) =>
                  set('modality', (v as PsychologistFilters['modality']) ?? 'all')
                }
                radius="md"
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Disponibilidade"
                placeholder="Qualquer dia"
                data={weekdayOptions}
                value={filters.weekday || null}
                onChange={(v) => set('weekday', v ?? '')}
                clearable
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Localização"
                placeholder="Todas"
                data={locationOptions}
                value={filters.location || null}
                onChange={(v) => set('location', v ?? '')}
                clearable
                radius="md"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Text fz={13} fw={500} mb={6}>
                Faixa de valor — até R$ {filters.maxPrice}
              </Text>
              <Select
                aria-label="Faixa de valor"
                data={['90', '130', '160', '190', String(maxPriceCap)].map(
                  (v) => ({ value: v, label: `Até R$ ${v}` })
                )}
                value={String(filters.maxPrice)}
                onChange={(v) => set('maxPrice', Number(v ?? maxPriceCap))}
                radius="md"
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Button
                variant="default"
                radius="md"
                fullWidth
                leftSection={<IconFilterOff size={16} />}
                disabled={!isFiltered}
                onClick={() => setFilters(initialFilters)}
              >
                Limpar filtros
              </Button>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Resultados */}
        {isError ? (
          <ErrorState
            message="Ocorreu um erro ao buscar psicólogos."
            onRetry={() => refetch()}
          />
        ) : isPending ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={300} radius={22} />
            ))}
          </SimpleGrid>
        ) : data.length === 0 ? (
          <EmptyState
            icon={IconMoodEmpty}
            title="Nenhum psicólogo encontrado"
            description="Tente ampliar os filtros ou limpar a busca."
            action={{ label: 'Limpar filtros', onClick: () => setFilters(initialFilters) }}
          />
        ) : (
          <Stack gap="md">
            <Text fz={14} c={palette.textSecondary}>
              {data.length}{' '}
              {data.length === 1
                ? 'profissional encontrado'
                : 'profissionais encontrados'}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {data.map((p) => (
                <PsychologistResultCard key={p.id} p={p} />
              ))}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </PageSkeleton>
  );
}
