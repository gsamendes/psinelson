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
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { AuthShell } from './AuthShell';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '../types';

export function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [role, setRole] = useState<UserRole>('patient');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(role === 'patient' ? '/patient/dashboard' : '/psychologist/dashboard');
  };

  return (
    <AuthShell title="Criar conta" subtitle="Comece sua jornada de cuidado no PsiApp.">
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
            label="Nome completo"
            placeholder="Seu nome"
            radius="md"
            leftSection={<IconUser size={16} />}
          />
          <TextInput
            label="E-mail"
            placeholder="voce@email.com"
            radius="md"
            leftSection={<IconMail size={16} />}
          />
          <PasswordInput
            label="Senha"
            placeholder="••••••••"
            radius="md"
            leftSection={<IconLock size={16} />}
          />
          <Button type="submit" color="psiGreen" radius="xl" size="md" fullWidth>
            Criar conta
          </Button>
          <Group justify="center" gap={6}>
            <Text fz={13} c="var(--psi-text-2)">
              Já tem conta?
            </Text>
            <Text component={Link} to="/login" fz={13} fw={600} c="var(--psi-green)">
              Entrar
            </Text>
          </Group>
        </Stack>
      </form>
    </AuthShell>
  );
}
