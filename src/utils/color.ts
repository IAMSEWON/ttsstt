// colors.ts

import { Appearance } from 'react-native';

export type Colors = {
  text: string;
  textAccent: string;
  background: string;
};

export const light: Colors = {
  text: '#222',
  textAccent: '#444',
  background: '#fff',
};

export const dark: Colors = {
  text: '#fff',
  textAccent: '#ccc',
  background: '#222',
};

const isDark = Appearance.getColorScheme() === 'dark';

// will always be the color theme from when file was first initialized
export const colors = isDark ? dark : light;
