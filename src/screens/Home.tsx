import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ColorSchemeName,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CirclePlus, Moon, Plus, SquarePen, Sun, Trash2, X } from 'lucide-react-native';

import SwipeItem from '@/components/SwipeItem';
import useThemeContext from '@/hooks/useThemeContext';
import { getData, setData } from '@/utils/storage';

type Category = { id: number; check: boolean; category: string };

const placeholderData = ['여행', '요리', '쇼핑', '회사', '공부'];

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

function Home() {
  const inputRef = useRef<TextInput>(null);
  const swipeRef = useRef<Swipeable>(null);

  const [categorys, setCategorys] = useState<Category[]>([]);

  const [updateCategoryId, setUpdateCategoryId] = useState<number>(0);

  const [categoryValue, setCategoryValue] = useState<string>('');

  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState<boolean>(false);

  const { colors, colorTheme, setColorTheme } = useThemeContext();

  // 카테고리 선택
  const onSelectCategory = (id: number) => {
    setCategorys(
      categorys.map((category) => ({
        ...category,
        check: category.id === id,
      })),
    );
    setIsOpenCategory(false);
  };

  // 카테고리 삭제
  const onDeleteCategory = async (id: number) => {
    // 카테고리가 선택되어있으면 삭제 불가능
    const isCheck = categorys.some((category) => category.id === id && category.check);

    if (isCheck) {
      Alert.alert('선택된 카테고리는 삭제할 수 없습니다.');
      return;
    }

    Alert.alert('정말 삭제하시겠습니까?', '', [
      {
        text: '취소',
        onPress: () => {
          swipeRef.current?.close();
        },
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: async () => {
          const updateCategorys = categorys.filter((category) => category.id !== id);

          setCategorys(updateCategorys);
          swipeRef.current?.close();
        },
      },
    ]);
  };

  // 카테고리 수정 폼 열기
  const onModifyCategory = (id: number, category: string) => {
    setUpdateCategoryId(id);
    setIsOpenCategoryForm(true);
    setCategoryValue(category);
  };

  // 카테고리 추가
  const onAddCategory = async () => {
    if (!categoryValue) {
      Alert.alert('카테고리를 입력해주세요.');
      return;
    }

    // 카테고리 데이터 텍스트 수정
    if (updateCategoryId) {
      const updateCategorys = categorys.map((category) => {
        if (category.id === updateCategoryId) {
          return {
            ...category,
            category: categoryValue,
          };
        }
        return category;
      });

      await setData('categorys', updateCategorys);

      setCategorys(updateCategorys);
      setIsOpenCategoryForm(!isOpenCategoryForm);
      setCategoryValue('');
      setUpdateCategoryId(0);
    } else {
      const isSameCategory = categorys.some((category) => category.category === categoryValue);

      if (isSameCategory) {
        Alert.alert('이미 존재하는 카테고리입니다.');
        inputRef.current?.focus();
        return;
      }

      const id = categorys.length ? categorys[categorys.length - 1].id + 1 : 1;

      const check = categorys.length === 0;

      const updateCategorys = [
        ...categorys,
        {
          id,
          check,
          category: categoryValue,
        },
      ];

      await setData('categorys', updateCategorys);

      setCategorys(updateCategorys);
      setIsOpenCategoryForm(!isOpenCategoryForm);
      setCategoryValue('');
    }
    swipeRef.current?.close();
  };

  // 초기화 함수
  const init = async () => {
    const categorysStorage: Category[] | null = await getData('categorys');

    if (!categorysStorage) return;

    setCategorys(categorysStorage);
  };

  useEffect(() => {
    init();
  }, []);

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
          <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: 40 }}>
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
              <SwipeItem
                value="새로운 카테고리"
                onPress={() => {
                  setIsOpenCategoryForm(true);
                }}
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
                  <SwipeItem
                    ref={swipeRef}
                    value={item.category}
                    check={item.check}
                    onPress={() => {
                      onSelectCategory(item.id);
                    }}
                    style={{ backgroundColor: colors.background }}
                    leftSide={
                      <TouchableOpacity
                        style={{
                          width: 60,
                          backgroundColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => onDeleteCategory(item.id)}
                      >
                        <Trash2 size={24} color="black" />
                      </TouchableOpacity>
                    }
                    rightSide={
                      <TouchableOpacity
                        style={{
                          width: 60,
                          backgroundColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => onModifyCategory(item.id, item.category)}
                      >
                        <SquarePen size={24} color="black" />
                      </TouchableOpacity>
                    }
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
      </View>
    </SafeAreaView>
  );
}
export default Home;
