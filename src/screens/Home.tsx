import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import { CirclePlus, Moon, Sun } from 'lucide-react-native';

import Carousel from '@/components/AnimatedTabBar';
import useThemeContext from '@/hooks/useThemeContext';
import { Colors } from '@/utils/color';

type Category = { id: number; category: string };

const categorysData: Category[] = [
  {
    id: 0,
    category: '여행',
  },
  {
    id: 1,
    category: '방송통신대학교방송통신대학교',
  },
  {
    id: 2,
    category: '공부',
  },
  {
    id: 3,
    category: '스포츠',
  },
  {
    id: 4,
    category: '음악',
  },
  {
    id: 5,
    category: '영화',
  },
  {
    id: 6,
    category: '독서',
  },
  {
    id: 7,
    category: '요리',
  },
  {
    id: 8,
    category: '쇼핑',
  },
];
const screenWidth = Dimensions.get('window').width;

const data: string[] = ['여행', '방송통신대학교', '공부', '스포츠', '음악', '영화', '독서', '요리', '쇼핑'];

function Category({ colors }: { colors: Colors }) {
  const [categorys, setCategorys] = useState<Category[]>(categorysData);
  const flatListRef = useRef<FlatList>(null);

  const [categoryIndex, setCategoryIndex] = useState<number>(0);

  const itemWidth = 100; // 각 아이템의 가로 길이 (적절하게 조정 필요)
  const gap = 10;

  const [categoryWidth, setCategoryWidth] = useState<number[]>([]);

  const [flatListWidth, setFlatListWidth] = useState(0);

  const isSelectCategoryHandler = (id: number) => {
    setCategorys(
      categorys.map((category) => ({
        ...category,
        isSelected: category.id === id,
      })),
    );
  };

  const snapToInterval = gap + categoryWidth.slice(0, categoryIndex).reduce((acc, cur) => acc + cur, 0);

  console.log('snapToInterval', snapToInterval);
  // useEffect(() => {
  //   if (!scrollViewWidth || categoryWidth.length < 1) return;

  //   const selectedCategoryIndex = categorys.findIndex((item) => item.isSelected);
  //   if (selectedCategoryIndex !== -1 && scrollViewRef.current) {
  //     const itemWidth = categoryWidth.slice(0, selectedCategoryIndex).reduce((acc, cur) => acc + cur, 0);
  //     // const itemWidth = categoryWidth[selectedCategoryIndex];

  //     const offsetX = scrollViewWidth / 2 - itemWidth - gap;

  //     // setScrollViewLeft(offsetX);
  //     scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
  //   }
  // }, [categorys, categoryWidth, scrollViewWidth]);

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      contentContainerStyle={{
        paddingHorizontal: (screenWidth - flatListWidth) * 1.5 + gap / 2,
        gap,
      }}
      keyExtractor={(item) => `${item.id}`}
      snapToInterval={gap + categoryWidth.slice(0, categoryIndex).reduce((acc, cur) => acc + cur, 0)}
      showsHorizontalScrollIndicator={false}
      data={categorysData}
      onScroll={(event) => {
        const isCategoryIndex = Math.round(event.nativeEvent.contentOffset.x / (flatListWidth + gap));

        console.log(isCategoryIndex);
        setCategoryIndex(isCategoryIndex);
      }}
      snapToAlignment="start"
      pagingEnabled
      onLayout={(event) => setFlatListWidth(event.nativeEvent.layout.width)}
      decelerationRate="fast"
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              isSelectCategoryHandler(item.id);

              // flatListRef.current?.scrollTo({ x: 250, animated: true });
            }}
            key={item.id}
            onLayout={(event) => {
              const arr = [...categoryWidth, event.nativeEvent.layout.width];
              setCategoryWidth(arr);
            }}
            style={{ paddingTop: 8 }}
          >
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: 'bold' }}>{item.category}</Text>
            <LinearGradient
              colors={['#f9ce34', '#ee2a7b', 'red']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                item.id === categoryIndex && {
                  width: '100%',
                  height: 2,
                  borderRadius: 10,
                },
                { marginTop: 4 },
              ]}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
}

function Home() {
  const sheetRef = useRef<BottomSheet>(null);

  const { colors, isSystemTheme, systemTheme, colorTheme, setColorTheme } = useThemeContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: 8,
        }}
      >
        <Pressable onPress={() => console.log('hi')}>
          <CirclePlus size={27} color={colors.text} />
        </Pressable>
        {/* <Category colors={colors} /> */}
        <Pressable onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}>
          {colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
        </Pressable>
        {/* <ActionSheet ref={sheetRef} /> */}
      </View>
      <Carousel
        gap={16}
        offset={36}
        pages={[
          {
            num: 1,
            color: '#86E3CE',
          },
          {
            num: 2,
            color: '#D0E6A5',
          },
          {
            num: 3,
            color: '#FFDD94',
          },
          {
            num: 4,
            color: '#FA897B',
          },
          {
            num: 5,
            color: '#CCABD8',
          },
        ]}
        pageWidth={screenWidth - (16 + 36) * 2}
      />
    </SafeAreaView>
  );
}

export default Home;
