import React from 'react';
import { Pressable } from 'react-native';
import { CirclePlus, Moon, Sun } from 'lucide-react-native';

import useThemeContext from '@/hooks/useThemeContext.ts';

function CategoryHeader({ onOpenCategory }: { onOpenCategory: () => void }) {
  const { colors, colorTheme, setColorTheme } = useThemeContext();
  return (
    <>
      <Pressable onPress={onOpenCategory}>
        <CirclePlus size={27} color={colors.text} />
      </Pressable>
      {/* <Category colors={colors} /> */}
      <Pressable onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}>
        {colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
      </Pressable>
    </>
  );
}

export default CategoryHeader;
