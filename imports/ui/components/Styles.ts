import { CardProps, PaperProps, useMantineTheme } from '@mantine/core';

export const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

export const CARD_PROPS: CardProps = {
  radius: 'md',
  style: { backgroundColor: 'var(--mantine-color-lightGray-0)', padding: '30px' },
};

export const ICON_PROPS = () => {
  const theme = useMantineTheme();
  return { size: theme.spacing.md };
};

export const ACCORDION_PROPS = () => {
  return { style: { backgroundColor: '#f8f9fa', border: 'none' } };
};

export const GRID_COL_PROPS: PaperProps = {
  shadow: 'md',
  // m: "md",
  // backgroundColor: 'white',
  style: { borderRadius: '8px' },
};
