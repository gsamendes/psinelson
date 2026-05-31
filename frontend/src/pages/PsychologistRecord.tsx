import {
  Alert,
  Avatar,
  Badge,
  Box,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconLock,
  IconShieldLock,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { PageSkeleton } from '../components/layout/PageSkeleton';
import { linkedPatients } from '../mocks/data';
import { palette } from '../theme';
import { shortDate } from '../utils/display';

export function PsychologistRecord() {
  return (
    <PageSkeleton
      title="Prontuário (demonstração)"
      subtitle="Placeholder visual. Nenhum dado clínico real é exibido ou armazenado nesta fase."
    >
      {/* Aviso de segurança */}
      <Alert
        color="orange"
        radius="md"
        icon={<IconAlertTriangle size={20} />}
        title="Área restrita — apenas demonstração"
      >
        <Stack gap={6}>
          <Text fz={14}>
            O prontuário clínico não está implementado. Dados clínicos reais exigem
            backend dedicado e os seguintes controles antes de qualquer exibição:
          </Text>
          <List size="sm" spacing={2}>
            <List.Item>Autenticação por <b>JWT</b> e autorização por <b>RBAC</b>.</List.Item>
            <List.Item>Isolamento multi-tenant via <b>tenant_id</b>.</List.Item>
            <List.Item>Verificação de <b>vínculo terapêutico</b> ativo paciente↔psicólogo.</List.Item>
            <List.Item>Registro de <b>auditoria</b> em toda operação sensível.</List.Item>
          </List>
        </Stack>
      </Alert>

      {/* Pacientes vinculados — prontuário bloqueado */}
      <Box>
        <Text fw={700} fz={16} mb="md">
          Pacientes vinculados
        </Text>
        <Stack gap="sm">
          {linkedPatients.map((p) => (
            <Group
              key={p.id}
              justify="space-between"
              wrap="nowrap"
              className="psi-card"
              p="md"
            >
              <Group gap={14} wrap="nowrap">
                <Avatar src={p.avatar} radius="xl" size={48} />
                <Box>
                  <Text fw={700} fz={15}>
                    {p.name}
                  </Text>
                  <Text fz={12} c={palette.textSecondary}>
                    Vínculo desde {shortDate(p.since)} • {p.sessions} sessões
                  </Text>
                </Box>
              </Group>
              <Badge
                variant="light"
                color="gray"
                radius="sm"
                size="lg"
                leftSection={<IconLock size={14} />}
              >
                Prontuário bloqueado
              </Badge>
            </Group>
          ))}
        </Stack>
      </Box>

      {/* Cartão explicativo */}
      <Box className="psi-card" p="xl" style={{ display: 'grid', placeItems: 'center' }}>
        <Stack align="center" gap={10} maw={520}>
          <ThemeIcon variant="light" color="psiTeal" radius="xl" size={64}>
            <IconShieldLock size={32} />
          </ThemeIcon>
          <Text fw={700} fz={18} ta="center">
            Conteúdo clínico protegido
          </Text>
          <Text fz={14} c={palette.textSecondary} ta="center">
            Esta tela existe apenas para ilustrar o fluxo. O acesso a anotações,
            histórico e evolução clínica será liberado somente com backend seguro,
            no 8º período.
          </Text>
        </Stack>
      </Box>
    </PageSkeleton>
  );
}
