import React from 'react';
import { Pressable, View } from 'react-native';
import { CirclePlus, Moon, Sun } from 'lucide-react-native';

import Carousel from '@/components/Carousel';
import useThemeContext from '@/hooks/useThemeContext.ts';
import { Category } from '@/types/category.ts';

function CategoryHeader({ onOpenCategory, categorys }: { onOpenCategory: () => void; categorys: Category[] }) {
  const { colors, colorTheme, setColorTheme } = useThemeContext();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Pressable onPress={onOpenCategory}>
        <CirclePlus size={27} color={colors.text} />
      </Pressable>
      <Carousel data={categorys} />
      <Pressable onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}>
        {colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
      </Pressable>
    </View>
  );
}

export default CategoryHeader;
