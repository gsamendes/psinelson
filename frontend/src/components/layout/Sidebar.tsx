import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconHome,
  IconInbox,
  IconLayoutDashboard,
  IconLogout,
  IconMessageCircle,
  IconReportMedical,
  IconSearch,
  type Icon,
} from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import classes from './Sidebar.module.css';

type Item = {
  label: string;
  icon: Icon;
  to: string;
};

const patientItems: Item[] = [
  { label: 'Início', icon: IconHome, to: '/patient/dashboard' },
  { label: 'Minhas Consultas', icon: IconCalendarEvent, to: '/patient/appointments' },
  { label: 'Encontrar Psicólogos', icon: IconSearch, to: '/patient/search' },
];

const psychologistItems: Item[] = [
  { label: 'Painel', icon: IconLayoutDashboard, to: '/psychologist/dashboard' },
  { label: 'Solicitações', icon: IconInbox, to: '/psychologist/requests' },
  { label: 'Agenda', icon: IconCalendarEvent, to: '/psychologist/schedule' },
  { label: 'Disponibilidade', icon: IconClock, to: '/psychologist/availability' },
  { label: 'Mensagens', icon: IconMessageCircle, to: '/psychologist/messages' },
  { label: 'Prontuário', icon: IconReportMedical, to: '/psychologist/record' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = user?.role === 'psychologist' ? psychologistItems : patientItems;

  return (
    <Box component="nav" className={classes.sidebar}>
      <Stack gap={14} align="center" className={classes.items}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;
          return (
            <Tooltip key={item.to} label={item.label} position="right" withArrow>
              <UnstyledButton
                aria-label={item.label}
                onClick={() => navigate(item.to)}
                className={`${classes.iconButton} ${isActive ? classes.active : ''}`}
              >
                <Icon size={22} stroke={1.8} />
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>

      <Tooltip label="Sair" position="right" withArrow>
        <UnstyledButton
          aria-label="Sair"
          className={classes.iconButton}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <IconLogout size={22} stroke={1.8} />
        </UnstyledButton>
      </Tooltip>
    </Box>
  );
}
