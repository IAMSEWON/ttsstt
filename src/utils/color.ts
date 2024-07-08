// colors.ts

import { Appearance } from 'react-native';

export type Colors = {
  opposite: string;
  text: string;
  textAccent: string;
  background: string;
  textPlaceholder: string;
  cardBackground: string;
  bottomSheetBackground: string;
};

export const light: Colors = {
  opposite: '#000',
  text: '#222',
  textAccent: '#444',
  background: '#f8f8fa',
  cardBackground: '#fff',
  textPlaceholder: '#00000040',
  bottomSheetBackground: '#f5f5f5',
};

export const dark: Colors = {
  opposite: '#fff',
  text: '#fff',
  textAccent: '#ccc',
  background: '#201d2b',
  cardBackground: '#272636',
  textPlaceholder: '#f1f3f520',
  bottomSheetBackground: '#2c2c2c',
};

const isDark = Appearance.getColorScheme() === 'dark';

// will always be the color theme from when file was first initialized
export const colors = isDark ? dark : light;
