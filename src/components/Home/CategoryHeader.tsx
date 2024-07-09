import React from 'react';
import { View } from 'react-native';
import { CirclePlus, Moon, Sun } from 'lucide-react-native';

import Carousel from '@/components/Home/Carousel.tsx';
import Icon from '@/components/Icon.tsx';
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
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Icon onPress={onOpenCategory} icon={<CirclePlus size={27} color={colors.text} />} />

      <Carousel data={categorys} page={page} setPage={setPage} />
      <Icon
        onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}
        icon={colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
      />
    </View>
  );
}

export default CategoryHeader;
