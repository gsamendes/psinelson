import { useState } from 'react';
import { Group, UnstyledButton, Text } from '@mantine/core';
import {
  IconMoodHappy,
  IconMoodSmile,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodCry,
} from '@tabler/icons-react';
import { moodOptions } from '../../mocks/data';
import type { MoodLevel } from '../../types';
import classes from './MoodSelector.module.css';

const icons: Record<MoodLevel, typeof IconMoodHappy> = {
  great: IconMoodHappy,
  good: IconMoodSmile,
  meh: IconMoodNeutral,
  bad: IconMoodSad,
  awful: IconMoodCry,
};

export function MoodSelector() {
  const [selected, setSelected] = useState<MoodLevel | null>(null);

  return (
    <Group gap={12}>
      {moodOptions.map((mood) => {
        const Icon = icons[mood.level];
        const isActive = selected === mood.level;
        return (
          <UnstyledButton
            key={mood.level}
            onClick={() => setSelected(mood.level)}
            className={`${classes.chip} ${isActive ? classes.active : ''}`}
            style={
              isActive
                ? { borderColor: mood.color, background: `${mood.color}1a` }
                : undefined
            }
          >
            <Icon size={20} stroke={1.8} color={mood.color} />
            <Text fz={13} fw={500}>
              {mood.label}
            </Text>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
