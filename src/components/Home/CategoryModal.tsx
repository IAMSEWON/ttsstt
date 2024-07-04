import React, { useRef, useState } from 'react';
import { Alert, Modal, Pressable, StyleProp, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info, Plus, SquarePen, Trash2, X } from 'lucide-react-native';

import SwipeItem from '@/components/SwipeItem.tsx';
import useThemeContext from '@/hooks/useThemeContext.ts';
import { Category } from '@/types/category.ts';
import { setData } from '@/utils/storage.ts';

const placeholderData = ['여행', '요리', '쇼핑', '회사', '공부'];

function CategoryHeaderIcon({
  style,
  onPress,
  icon,
}: {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          marginHorizontal: 4,
          marginVertical: 8,
        },
        style,
      ]}
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
        {icon}
      </Pressable>
    </View>
  );
}

function CategoryModal({
  open,
  setOpen,
  categorys,
  setCategorys,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categorys: Category[];
  setCategorys: React.Dispatch<React.SetStateAction<Category[]>>;
}) {
  const { colors, colorTheme } = useThemeContext();

  const { top } = useSafeAreaInsets();

  const [isDrag, setIsDrag] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);
  const swipeRef = useRef<Swipeable[] | null[]>([]);

  const [updateCategoryId, setUpdateCategoryId] = useState<number>(0);

  const [categoryValue, setCategoryValue] = useState<string>('');

  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState<boolean>(false);

  // 카테고리 선택
  const onSelectCategory = (id: number) => {
    setCategorys(
      categorys.map((category) => ({
        ...category,
        check: category.id === id,
      })),
    );
    setOpen(false);
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
          swipeRef.current[id]?.close();
        },
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: async () => {
          const updateCategorys = categorys.filter((category) => category.id !== id);

          setCategorys(updateCategorys);
          swipeRef.current[id]?.close();
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
    swipeRef.current[updateCategoryId]?.close();
  };

  return (
    <Modal
      animationType="fade"
      visible={open}
      onRequestClose={() => {
        setOpen(!open);
      }}
      presentationStyle="fullScreen"
    >
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: top }}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 20,
            paddingHorizontal: 15,
            justifyContent: 'space-between',
          }}
        >
          {/* 모달 카테고리 정보 버튼 */}
          <CategoryHeaderIcon
            onPress={() => {}}
            icon={colorTheme === 'dark' ? <Info size={27} color="white" /> : <Info size={27} color="black" />}
          />
          {/* 모달 카테고리 닫기 버튼 */}
          <CategoryHeaderIcon
            onPress={() => setOpen(false)}
            icon={colorTheme === 'dark' ? <X size={27} color="white" /> : <X size={27} color="black" />}
          />
        </View>
        {/* 모달 카테고리 추가 버튼 */}
        <View
          style={{
            marginHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => setIsOpenCategoryForm(true)}>
            <SwipeItem
              value="새로운 카테고리"
              icon={
                <CategoryHeaderIcon
                  style={{ marginHorizontal: 0, marginVertical: 0 }}
                  onPress={() => {}}
                  icon={colorTheme === 'dark' ? <Plus size={27} color="white" /> : <Plus size={27} color="black" />}
                />
              }
            />
          </TouchableOpacity>
        </View>
        {/* 모달 카테고리 드래그 앤 드랍 리스트 */}
        <NestableScrollContainer>
          <NestableDraggableFlatList
            data={categorys}
            onDragBegin={() => {
              setIsDrag(true);
            }}
            onDragEnd={({ data }) => {
              setCategorys(data);
              setData('categorys', data);
            }}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, drag, isActive }) => {
              return (
                <ScaleDecorator key={`${item.id}-${item.category}`}>
                  <View
                    style={{
                      marginHorizontal: 20,
                    }}
                    onStartShouldSetResponder={() => true}
                  >
                    <TouchableOpacity onLongPress={drag} disabled={isActive}>
                      <SwipeItem
                        ref={(ref) => {
                          swipeRef.current[item.id] = ref;
                        }}
                        drag={isDrag}
                        value={item.category}
                        check={item.check}
                        // onPress={() => {
                        //   onSelectCategory(item.id);
                        // }}
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
                    </TouchableOpacity>
                  </View>
                </ScaleDecorator>
              );
            }}
          />
        </NestableScrollContainer>
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
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
            <CategoryHeaderIcon
              onPress={() => setIsOpenCategoryForm(false)}
              icon={colorTheme === 'dark' ? <X size={27} color="white" /> : <X size={27} color="black" />}
            />
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
  );
}

export default CategoryModal;
