import React, { useRef, useState } from 'react';
import {
  Alert,
  ColorSchemeName,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheet from '@gorhom/bottom-sheet';
import { CirclePlus, Moon, Plus, Sun, X } from 'lucide-react-native';

import useThemeContext from '@/hooks/useThemeContext';
import { Colors } from '@/utils/color';

type Category = { id: number; check: boolean; category: string };

const screenWidth = Dimensions.get('window').width;

const placeholderData = ['여행', '요리', '쇼핑', '회사', '공부'];

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

function CategoryClose({ theme, onPress }: { theme: NonNullable<ColorSchemeName>; onPress: () => void }) {
  return (
    <View
      style={{
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginHorizontal: 4,
        marginVertical: 8,
      }}
    >
      <Pressable
        style={{
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onPress}
      >
        {theme === 'dark' ? <X size={32} color="white" /> : <X size={32} color="black" />}
      </Pressable>
    </View>
  );
}

function CategoryItem({
  value,
  onPress,
  check = false,
  icon,
}: {
  value: string;
  onPress: () => void;
  check?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>{value}</Text>
      {icon || (
        <View
          style={{
            backgroundColor: 'white',
            width: 24,
            height: 24,
            marginRight: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 16, height: 16, backgroundColor: check ? 'black' : 'transparent' }} />
        </View>
      )}
    </Pressable>
  );
}

function Home() {
  const sheetRef = useRef<BottomSheet>(null);

  const inputRef = useRef<TextInput>(null);

  const [categorys, setCategorys] = useState<Category[]>([]);

  const [categoryValue, setCategoryValue] = useState<string>('');

  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState<boolean>(false);

  const { colors, colorTheme, setColorTheme } = useThemeContext();

  const onChangeCategory = (id: number) => {
    setCategorys(
      categorys.map((category) => ({
        ...category,
        check: category.id === id,
      })),
    );
    setIsOpenCategory(false);
  };

  const onAddCategory = () => {
    if (!categoryValue) {
      Alert.alert('카테고리를 입력해주세요.');
      return;
    }

    const isSameCategory = categorys.some((category) => category.category === categoryValue);

    if (isSameCategory) {
      Alert.alert('이미 존재하는 카테고리입니다.');
      console.log(inputRef.current);
      inputRef.current?.focus();
      return;
    }

    const id = categorys.length > 0 ? categorys[categorys.length - 1].id + 1 : 0;
    const check = categorys.length === 0;

    setCategorys([
      ...categorys,
      {
        id,
        check,
        category: categoryValue,
      },
    ]);

    setIsOpenCategoryForm(!isOpenCategoryForm);
    setCategoryValue('');
  };

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
        <Pressable onPress={() => setIsOpenCategory(true)}>
          <CirclePlus size={27} color={colors.text} />
        </Pressable>
        {/* <Category colors={colors} /> */}
        <Pressable onPress={() => setColorTheme(colorTheme === 'dark' ? 'light' : 'dark')}>
          {colorTheme === 'dark' ? <Sun size={27} color="white" /> : <Moon size={27} color="black" />}
        </Pressable>

        <Modal
          animationType="slide"
          visible={isOpenCategory}
          onRequestClose={() => {
            setIsOpenCategory(!isOpenCategory);
          }}
          presentationStyle="pageSheet"
        >
          <View style={{ flex: 1, backgroundColor: '#3b3b3b', paddingBottom: 40 }}>
            {/* 모달 카테고리 닫기 버튼 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginHorizontal: 4,
                marginVertical: 8,
              }}
            >
              <CategoryClose theme={colorTheme} onPress={() => setIsOpenCategory(!isOpenCategory)} />
            </View>
            {/* 모달 카테고리 추가 버튼 */}
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              <CategoryItem
                value="새로운 카테고리"
                onPress={() => setIsOpenCategoryForm(true)}
                icon={<Plus size={32} color="white" />}
              />
            </View>
            {/* 모달 카테고리 리스트 */}
            <FlatList
              data={categorys}
              contentContainerStyle={{
                marginHorizontal: 20,
                marginBottom: 20,
              }}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => {
                return (
                  <CategoryItem
                    value={item.category}
                    check={item.check}
                    onPress={() => {
                      onChangeCategory(item.id);
                    }}
                  />
                );
              }}
            />
          </View>
          {/* 모달 카테고리 추가 폼 */}
          <Modal
            animationType="slide"
            visible={isOpenCategoryForm}
            onRequestClose={() => {
              setCategoryValue('');
              setIsOpenCategoryForm(!isOpenCategoryForm);
            }}
            presentationStyle="pageSheet"
          >
            <View style={{ flex: 1, backgroundColor: '#3b3b3b' }}>
              {/* 모달 카테고리 닫기 버튼 */}
              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginHorizontal: 4,
                  marginVertical: 8,
                }}
              >
                <CategoryClose theme={colorTheme} onPress={() => setIsOpenCategoryForm(false)} />
              </View>
              <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>새로운 카테고리 시작</Text>
                <Text style={{ color: '#f1f3f520', fontSize: 21, fontWeight: 'bold' }}>
                  명확하고 간단한 단어를 입력하세요.
                </Text>
                <View style={{ flex: 1, width: 250, marginHorizontal: 40, alignItems: 'center' }}>
                  <TextInput
                    ref={inputRef}
                    style={{ fontSize: 30, width: '100%', fontWeight: 'bold', color: 'white', textAlign: 'center' }}
                    value={categoryValue}
                    onChangeText={(text) => {
                      setCategoryValue(text.replace(/(\s*)/g, ''));
                    }}
                    placeholder={placeholderData[0]}
                    placeholderTextColor="#f1f3f530"
                    returnKeyType="done"
                    autoFocus
                    onSubmitEditing={onAddCategory}
                  />
                  {!categoryValue &&
                    placeholderData
                      .filter((item, index) => index > 0)
                      .map((item) => {
                        return (
                          <Text key={item} style={{ fontSize: 30, color: '#f1f3f530', fontWeight: 'bold' }}>
                            {item}
                          </Text>
                        );
                      })}
                </View>
              </View>
            </View>
          </Modal>
        </Modal>
        {/* <ActionSheet ref={sheetRef} /> */}
      </View>
    </SafeAreaView>
  );
}
export default Home;
