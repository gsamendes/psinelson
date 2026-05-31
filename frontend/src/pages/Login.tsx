import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Group,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLock, IconMail } from '@tabler/icons-react';
import { AuthShell } from './AuthShell';
import { useAuthStore } from '../stores/authStore';
import { USE_MOCKS } from '../config/runtime';
import type { UserRole } from '../types';

const home = (role: UserRole) =>
  role === 'patient' ? '/patient/dashboard' : '/psychologist/dashboard';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const signIn = useAuthStore((s) => s.signIn);
  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('camila.souza@email.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Modo mock (padrão): login simulado por papel — sem rede.
    if (USE_MOCKS) {
      login(role);
      navigate(home(role));
      return;
    }

    // Modo real: autentica na API e navega pelo papel retornado.
    setLoading(true);
    try {
      const realRole = await signIn(email, password);
      navigate(home(realRole));
    } catch (err) {
      notifications.show({
        color: 'red',
        title: 'Não foi possível entrar',
        message: err instanceof Error ? err.message : 'Verifique suas credenciais.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta para continuar.">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <SegmentedControl
            fullWidth
            radius="xl"
            color="psiGreen"
            value={role}
            onChange={(v) => setRole(v as UserRole)}
            data={[
              { label: 'Sou Paciente', value: 'patient' },
              { label: 'Sou Psicólogo', value: 'psychologist' },
            ]}
          />
          <TextInput
            label="E-mail"
            placeholder="voce@email.com"
            radius="md"
            leftSection={<IconMail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <PasswordInput
            label="Senha"
            placeholder="••••••••"
            radius="md"
            leftSection={<IconLock size={16} />}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button type="submit" color="psiGreen" radius="xl" size="md" fullWidth loading={loading}>
            Entrar
          </Button>
          <Group justify="center" gap={6}>
            <Text fz={13} c="var(--psi-text-2)">
              Não tem conta?
            </Text>
            <Text component={Link} to="/register" fz={13} fw={600} c="var(--psi-green)">
              Cadastre-se
            </Text>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
}
