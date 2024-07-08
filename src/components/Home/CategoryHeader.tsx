import React from 'react';
import { Pressable, View } from 'react-native';
import { CirclePlus, Moon, Sun } from 'lucide-react-native';

import Carousel from '@/components/Home/Carousel.tsx';
import useThemeContext from '@/hooks/useThemeContext.ts';
import { CategoryGroupType } from '@/types/category.ts';

type CategoryHeaderProps = {
  onOpenCategory: () => void;
  categorys: CategoryGroupType[];
  page: number;
  setPage: (page: number) => void;
};

function CategoryHeader({ onOpenCategory, categorys, page, setPage }: CategoryHeaderProps) {
  const { colors, colorTheme, setColorTheme } = useThemeContext();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 10,
      }}
    >
      <Pressable onPress={onOpenCategory}>
        <CirclePlus size={27} color={colors.text} />
      </Pressable>
      <Carousel data={categorys} page={page} setPage={setPage} />
      <Pressable onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}>
        {colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
      </Pressable>
    </View>
  );
}

export default CategoryHeader;
