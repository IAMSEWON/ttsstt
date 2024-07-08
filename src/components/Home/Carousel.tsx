import React, { useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useThemeContext from '@/hooks/useThemeContext.ts';
import { CategoryGroupType } from '@/types/category.ts';

const gap = 16;

const textWidth = 120;

type CarouselProps = {
  page: number;
  setPage: (page: number) => void;
  data: CategoryGroupType[];
};

function Carousel({ data, page, setPage }: CarouselProps) {
  const [listWidth, setListWidth] = useState<number>(0);

  const { colors, colorTheme } = useThemeContext();

  const gradientColors = colorTheme === 'light' ? ['#1488CC', '#2B32B2'] : ['#00c3ff', '#ffff1c'];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (textWidth + gap));
    setPage(newPage);
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: (listWidth - textWidth - gap) / 2,
          marginHorizontal: 2,
          paddingTop: 2.5,
        }}
        onLayout={(e) => setListWidth(e.nativeEvent.layout.width)}
        onScroll={onScroll}
        decelerationRate="fast"
        snapToInterval={textWidth + gap}
        snapToAlignment="start"
        pagingEnabled
        horizontal
        keyExtractor={(item) => String(item.id)}
        data={data}
        renderItem={({ item, index }) => {
          const isSelect = index === page;
          return (
            <View
              style={[
                {
                  marginHorizontal: gap / 2,
                  width: textWidth,
                  padding: 0,
                  opacity: 0.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                isSelect && { opacity: 1 },
              ]}
            >
              <View style={{ flexDirection: 'column', gap: 2 }}>
                <Text style={[isSelect && { fontWeight: 'bold' }, { fontSize: 21, color: colors.text }]}>
                  {item.categoryName}
                </Text>

                <LinearGradient
                  colors={isSelect ? gradientColors : ['transparent', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  style={{ height: 2.5, borderRadius: 100 }}
                />
              </View>
            </View>
          );
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default Carousel;
