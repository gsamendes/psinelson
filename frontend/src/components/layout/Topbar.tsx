import { NavLink, useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {
  IconBell,
  IconBrandMantine,
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconSettings,
} from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { palette } from '../../theme';
import classes from './Topbar.module.css';

const patientNav = [
  { label: 'Início', to: '/patient/dashboard' },
  { label: 'Minhas Consultas', to: '/patient/appointments' },
  { label: 'Encontrar Psicólogos', to: '/patient/search' },
];

const psychologistNav = [
  { label: 'Painel', to: '/psychologist/dashboard' },
  { label: 'Solicitações', to: '/psychologist/requests' },
  { label: 'Agenda', to: '/psychologist/schedule' },
  { label: 'Disponibilidade', to: '/psychologist/availability' },
  { label: 'Mensagens', to: '/psychologist/messages' },
  { label: 'Prontuário', to: '/psychologist/record' },
];

export function Topbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = user?.role === 'psychologist' ? psychologistNav : patientNav;

  return (
    <Box className={classes.topbar}>
      <Group gap={48} wrap="nowrap" style={{ flex: 1 }}>
        <Group gap={10} wrap="nowrap" className={classes.logo}>
          <Box className={classes.logoMark}>
            <IconBrandMantine size={22} stroke={2} />
          </Box>
          <Text fw={800} fz={22} c={palette.greenDark}>
            PsiApp
          </Text>
        </Group>

        <Group gap={6} wrap="nowrap" className={classes.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `${classes.navItem} ${isActive ? classes.navItemActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </Group>
      </Group>

      <Group gap={14} wrap="nowrap">
        <TextInput
          placeholder="Buscar psicólogo, temas..."
          leftSection={<IconSearch size={16} />}
          radius="xl"
          w={240}
          className={classes.search}
          visibleFrom="md"
        />
        <ActionIcon variant="subtle" radius="xl" size={42} color="gray">
          <IconBell size={20} />
        </ActionIcon>
        <ActionIcon variant="subtle" radius="xl" size={42} color="gray">
          <IconSettings size={20} />
        </ActionIcon>

        <Menu position="bottom-end" radius="md" shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton className={classes.profile}>
              <Avatar src={user?.avatar} radius="xl" size={40}>
                {user?.name.charAt(0)}
              </Avatar>
              <Box visibleFrom="lg" style={{ lineHeight: 1.2 }}>
                <Text fw={600} fz={13}>
                  {user?.name}
                </Text>
                <Text fz={11} c={palette.textSecondary}>
                  {user?.email}
                </Text>
              </Box>
              <IconChevronDown size={16} color={palette.textSecondary} />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Sair
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
