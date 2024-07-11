import React, { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Text, View } from 'react-native';

import useThemeContext from '@/hooks/useThemeContext.ts';
import { PermissionType } from '@/types/permission.tsx';

const gap = 16;

type CarouselProps = {
  data: PermissionType[];
  onSelectItem: (index: number) => void;
};

function Carousel({ data, onSelectItem }: CarouselProps) {
  const [listWidth, setListWidth] = useState<number>(0);

  const [page, setPage] = useState<number>(0);

  const flatListRef = useRef<FlatList>(null);

  const { colors, colorTheme } = useThemeContext();

  const gradientColors = colorTheme === 'light' ? ['#1488CC', '#2B32B2'] : ['#00c3ff', '#ffff1c'];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (listWidth + gap));

    const scrollPage = newPage < 0 ? 0 : newPage;
    onSelectItem(scrollPage);
    setPage(scrollPage);
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: (listWidth - listWidth - gap) / 2,
          marginHorizontal: 2,
          marginTop: 40,
        }}
        ref={flatListRef}
        onLayout={(e) => setListWidth(e.nativeEvent.layout.width)}
        onScroll={onScroll}
        decelerationRate="fast"
        snapToInterval={listWidth + gap}
        snapToAlignment="start"
        pagingEnabled
        horizontal
        keyExtractor={(item) => String(item)}
        data={data}
        renderItem={({ item, index }) => {
          const isSelect = index === page;
          return (
            <View
              style={[
                {
                  marginHorizontal: gap / 2,
                  width: listWidth,
                  padding: 0,
                  opacity: 0.5,
                  alignItems: 'center',
                },
                isSelect && { opacity: 1 },
              ]}
            >
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <Text style={[isSelect && { fontWeight: 'bold' }, { fontSize: 23, color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[isSelect && { fontWeight: 'bold' }, { fontSize: 18.5, color: colors.text }]}>
                  {item.description}
                </Text>
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
