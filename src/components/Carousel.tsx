import React, { useState } from 'react';
import { FlatList, LayoutChangeEvent, Text, View } from 'react-native';

import { Category } from '@/types/category.ts';

const gap = 16;

const textWidth = 80;

type CarouselProps = {
  data: Category[];
};

function Carousel({ data }: CarouselProps) {
  const [listWidth, setListWidth] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [itemWidth, setItemWidth] = useState<number[]>([]);

  const onScroll = (e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (textWidth + gap));
    setPage(newPage);
  };

  const textWidthLayout = (event: LayoutChangeEvent, index) => {};

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: (listWidth - textWidth - gap) / 2,
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
        renderItem={({ item, index }) => (
          <View style={{ marginHorizontal: gap / 2, width: textWidth, backgroundColor: 'black' }}>
            <Text onLayout={(event) => textWidthLayout(event, index)}>{item.category}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

export default Carousel;
