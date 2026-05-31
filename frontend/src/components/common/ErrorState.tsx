import { Alert, Button, Group, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

/** Estado de erro padrão com ação de "Tentar novamente". */
export function ErrorState({
  message = 'Ocorreu um erro ao carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert
      color="red"
      radius="md"
      icon={<IconAlertTriangle size={18} />}
      title="Não foi possível carregar"
    >
      <Group justify="space-between" wrap="nowrap">
        <Text fz={14}>{message}</Text>
        <Button size="xs" variant="white" color="red" onClick={onRetry}>
          Tentar novamente
        </Button>
      </Group>
    </Alert>
  );
}
