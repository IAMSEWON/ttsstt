// colors.ts

import { Appearance } from 'react-native';

export type Colors = {
  text: string;
  textAccent: string;
  background: string;
  bottomSheetBackground: string;
};

export const light: Colors = {
  text: '#222',
  textAccent: '#444',
  background: '#fff',
  bottomSheetBackground: '#f5f5f5',
};

export const dark: Colors = {
  text: '#fff',
  textAccent: '#ccc',
  background: '#3b3b3b',
  bottomSheetBackground: '#2c2c2c',
};

const isDark = Appearance.getColorScheme() === 'dark';

// will always be the color theme from when file was first initialized
export const colors = isDark ? dark : light;
