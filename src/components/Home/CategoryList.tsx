import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  ViewToken,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import HomeButton from '@/components/Home/HomeButton.tsx';
import useThemeContext from '@/hooks/useThemeContext.ts';
import { CategoryListType } from '@/types/category.ts';

// const categoryList: CategoryListType[] = [
//   {
//     id: 1,
//     title: 'title1',
//     date: '2021-08-01',
//     text: 'asabsjdbaskjdbkajsbdkjasbdkjasbkjasbdkjsabkjdbaskjbadskjbdkjsabdkjsabkdjsabkjdbsajkdbsakjbdaskjbdjksabdsakjbjk',
//   },
//   {
//     id: 2,
//     title: 'title2',
//     date: '2021-08-02',
//     text: 'text2',
//   },
//   {
//     id: 3,
//     title: 'title3',
//     date: '2021-08-03',
//     text: 'text3',
//   },
//   {
//     id: 4,
//     title: 'title4',
//     date: '2021-08-04',
//     text: 'text4',
//   },
//   {
//     id: 5,
//     title: 'title5',
//     date: '2021-08-05',
//     text: 'text5',
//   },
//   {
//     id: 6,
//     title: 'title6',
//     date: '2021-08-06',
//     text: 'text6',
//   },
//   {
//     id: 7,
//     title: 'title7',
//     date: '2021-08-07',
//     text: 'text7',
//   },
//   {
//     id: 8,
//     title: 'title8',
//     date: '2021-08-08',
//     text: 'text8',
//   },
//   {
//     id: 9,
//     title: 'title9',
//     date: '2021-08-09',
//     text: 'text9',
//   },
//   {
//     id: 10,
//     title: 'title10',
//     date: '2021-08-10',
//     text: 'text10',
//   },
//   {
//     id: 11,
//     title: 'title11',
//     date: '2021-08-11',
//     text: 'text11',
//   },
//   {
//     id: 12,
//     title: 'title12',
//     date: '2021-08-12',
//     text: 'text12',
//   },
//   {
//     id: 13,
//     title: 'title13',
//     date: '2021-08-13',
//     text: 'text13',
//   },
//   {
//     id: 14,
//     title: 'title14',
//     date: '2021-08-14',
//     text: 'text14',
//   },
//   {
//     id: 15,
//     title: 'title15',
//     date: '2021-08-15',
//     text: 'text15',
//   },
//   {
//     id: 16,
//     title: 'title16',
//     date: '2021-08-16',
//     text: 'text16',
//   },
// ];

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const gap = 10;
const availableSpace = screenWidth - (numColumns - 1) * gap;
const itemSize = availableSpace / numColumns;

function CategoryItem({ item, viewableItems }: { item: CategoryListType; viewableItems: SharedValue<ViewToken[]> }) {
  const { colors } = useThemeContext();

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value.filter((_item) => _item.isViewable).find((viewableItem) => viewableItem.item.id === item.id),
    );

    return {
      opacity: withTiming(isVisible ? 1 : 0),
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          height: itemSize - gap, // Adjusted size to account for margin
          width: itemSize - gap, // Adjusted size to account for margin
          padding: 10,
          borderRadius: 20,
          overflow: 'hidden',
          gap: 10,
          backgroundColor: colors.cardBackground,
        },
        rStyle,
      ]}
    >
      <Text style={{ fontSize: 23, fontWeight: 'bold', color: colors.text }}>{item.title}</Text>
      <View style={{ height: 1, width: '100%', backgroundColor: '#f1f3f5' }} />
      <Text style={{ fontSize: 23, fontWeight: 'bold', color: colors.text, marginBottom: 6 }}>{item.text}</Text>
      <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.text, position: 'absolute', bottom: 6, right: 6 }}>
        {item.date}
      </Text>
      <LinearGradient
        colors={['transparent', colors.cardBackground]} // Adjust these colors to match your desired shadow effect
        style={{
          zIndex: 999,
          borderRadius: 10,
          position: 'absolute',
          bottom: -10,
          height: 40,
          shadowRadius: 20,
          width: itemSize - gap,
          overflow: 'hidden', // Ensures the gradient respects the borderRadius
        }}
      />
    </Animated.View>
  );
}

function CategoryList({ list }: { list: CategoryListType[] }) {
  const { colors } = useThemeContext();

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const [isScroll, setIsScroll] = useState(false);

  // Flatlist 스크롤 초기값
  const initialScrollY = useRef(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (list.length < 1) return;

    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY > initialScrollY.current) {
      setIsScroll(false);
    } else if (currentScrollY < initialScrollY.current) {
      setIsScroll(true);
    }
    initialScrollY.current = currentScrollY;
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <FlatList
        data={list}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => `${item.id}-${item.title}`}
        contentContainerStyle={{ gap, paddingVertical: 10, flex: 1 }}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        onScrollBeginDrag={onScroll}
        columnWrapperStyle={{ gap }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Image source={require('@/assets/no_data.png')} style={{ width: 128, height: 128 }} />
            <Text style={{ color: colors.text, fontSize: 19 }}>새로운 메모 시작하기</Text>
          </View>
        }
        renderItem={({ item }) => <CategoryItem item={item} viewableItems={viewableItems} />}
      />
      <HomeButton colors={colors} isHidden={isScroll} />
    </View>
  );
}

export default CategoryList;
