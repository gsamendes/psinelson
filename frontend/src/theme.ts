import { createTheme, type MantineColorsTuple } from '@mantine/core';

const psiGreen: MantineColorsTuple = [
  '#eef3ee',
  '#dce6dd',
  '#b6ccb9',
  '#8fb293',
  '#719c76',
  '#5f8f66',
  '#54885c',
  '#43744b',
  '#396740',
  '#2c5934',
];

const psiTeal: MantineColorsTuple = [
  '#e7f2f2',
  '#d3e3e4',
  '#a6c6c8',
  '#76a8ab',
  '#508f93',
  '#388286',
  '#287b7f',
  '#176a6e',
  '#055e62',
  '#005155',
];

export const theme = createTheme({
  primaryColor: 'psiGreen',
  primaryShade: 5,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  headings: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: '700',
  },
  defaultRadius: 'lg',
  radius: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '26px',
  },
  colors: {
    psiGreen,
    psiTeal,
  },
  white: '#ffffff',
  black: '#1f1f1f',
});

export const palette = {
  bg: '#F7F3ED',
  green: '#5F7F62',
  greenDark: '#2F5D50',
  teal: '#2F6F73',
  card: '#FFFFFF',
  textPrimary: '#1F1F1F',
  textSecondary: '#6F6A64',
  border: '#E6DED4',
};
