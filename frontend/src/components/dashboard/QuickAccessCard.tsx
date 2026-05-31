import { Box, SimpleGrid, Text, UnstyledButton } from '@mantine/core';
import {
  IconActivity,
  IconBook2,
  IconCalendarEvent,
  IconMessage,
  type Icon,
} from '@tabler/icons-react';
import classes from './QuickAccessCard.module.css';

type Item = {
  label: string;
  icon: Icon;
  bg: string;
  fg: string;
};

const items: Item[] = [
  { label: 'Mensagens', icon: IconMessage, bg: '#E7F0E8', fg: '#4F8A5E' },
  { label: 'Minhas Consultas', icon: IconCalendarEvent, bg: '#E6F0F1', fg: '#3E8488' },
  { label: 'Exercícios', icon: IconActivity, bg: '#F5ECDC', fg: '#C79A3F' },
  { label: 'Recursos', icon: IconBook2, bg: '#EFEAF7', fg: '#7B6BA8' },
];

export function QuickAccessCard() {
  return (
    <Box className="psi-card" p="lg">
      <Text fw={700} fz={16} mb="md">
        Acesso Rápido
      </Text>
      <SimpleGrid cols={2} spacing={12}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <UnstyledButton key={item.label} className={classes.tile}>
              <Box className={classes.iconWrap} style={{ background: item.bg }}>
                <Icon size={22} color={item.fg} stroke={1.8} />
              </Box>
              <Text fz={12} fw={500} ta="center">
                {item.label}
              </Text>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
