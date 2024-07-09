import React, { useRef, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowDownUp, X } from 'lucide-react-native';

import CategoryButton from '@/components/Home/CategoryButton.tsx';
import Icon from '@/components/Icon.tsx';
import Layout from '@/components/Layout.tsx';
import useThemeContext from '@/hooks/useThemeContext.ts';
import { CategoryGroupType } from '@/types/category.ts';
import { setData } from '@/utils/storage.ts';

const placeholderData = ['여행', '요리', '쇼핑', '회사', '공부'];

function CategoryModal({
  open,
  setOpen,
  categorys,
  setCategorys,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categorys: CategoryGroupType[];
  setCategorys: React.Dispatch<React.SetStateAction<CategoryGroupType[]>>;
}) {
  const { colors, colorTheme } = useThemeContext();

  const [isDragAndDrop, setIsDragAndDrop] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const swipeRef = useRef<Swipeable[] | null[]>([]);

  const [updateCategoryId, setUpdateCategoryId] = useState<number>(0);

  const [categoryValue, setCategoryValue] = useState<string>('');

  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState<boolean>(false);

  // 선택한 카테고리 그라디언트 컬러
  const gradientColors = colorTheme === 'light' ? ['#1488CC', '#2B32B2'] : ['#00c3ff', '#ffff1c'];

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
  const onModifyCategory = (id: number, categoryName: string) => {
    setUpdateCategoryId(id);
    setIsOpenCategoryForm(true);
    setCategoryValue(categoryName);
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
            categoryName: categoryValue,
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
      const isSameCategory = categorys.some((category) => category.categoryName === categoryValue);

      if (isSameCategory) {
        Alert.alert('이미 존재하는 카테고리입니다.');
        inputRef.current?.focus();
        return;
      }

      const id = categorys.length ? categorys[categorys.length - 1].id + 1 : 1;

      const check = categorys.length === 0;

      const updateCategorys: CategoryGroupType[] = [
        ...categorys,
        {
          id,
          categoryName: categoryValue,
          check,
          list: [],
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
      <Layout
        header={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* 모달 카테고리 정렬 버튼 */}
              <Icon
                onPress={() => setIsDragAndDrop(!isDragAndDrop)}
                icon={<ArrowDownUp size={27} color={isDragAndDrop ? 'red' : colors.text} />}
              />
            </View>
            {/* 모달 카테고리 닫기 버튼 */}
            <Icon onPress={() => setOpen(false)} icon={<X size={27} color={colors.text} />} />
          </View>
        }
      >
        {/* 모달 카테고리 드래그 앤 드랍 리스트 */}
        <NestableScrollContainer>
          <NestableDraggableFlatList
            data={categorys}
            onDragEnd={
              isDragAndDrop
                ? ({ data }) => {
                    setCategorys(data);
                    setData('categorys', data);
                  }
                : undefined
            }
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, drag, isActive }) => {
              return (
                <ScaleDecorator key={`${item.id}-${item.categoryName}`}>
                  <ContextMenu
                    actions={[{ title: '수정' }, { title: '삭제' }]}
                    disabled={isDragAndDrop}
                    onPress={(e) => {
                      if (e.nativeEvent.name === '수정') {
                        onModifyCategory(item.id, item.categoryName);
                        return;
                      }

                      if (e.nativeEvent.name === '삭제') {
                        onDeleteCategory(item.id);
                      }
                    }}
                  >
                    <TouchableOpacity
                      onLongPress={isDragAndDrop ? drag : undefined}
                      onPress={() => {
                        onSelectCategory(item.id);
                      }}
                      style={{ backgroundColor: colors.background }}
                      disabled={isActive}
                    >
                      <View
                        style={[
                          {
                            alignSelf: 'flex-start',
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 2,
                          }}
                        >
                          <Text style={{ color: colors.text, fontSize: 32, fontWeight: 'bold' }}>
                            {item.categoryName}
                          </Text>
                          <Text
                            style={{
                              color: colors.textPlaceholder,
                              fontSize: 21,
                            }}
                          >{`(${item.list.length})`}</Text>
                        </View>
                        <LinearGradient
                          colors={item.check ? gradientColors : ['transparent', 'transparent']}
                          start={{ x: 0, y: 0 }}
                          style={{ height: 2.5, borderRadius: 100, width: 'auto' }}
                        />
                      </View>
                    </TouchableOpacity>
                  </ContextMenu>
                </ScaleDecorator>
              );
            }}
          />
        </NestableScrollContainer>
      </Layout>
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
            <Icon
              onPress={() => {
                setCategoryValue('');
                setIsOpenCategoryForm(false);
              }}
              icon={<X size={27} color={colors.text} />}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center', gap: 20 }}>
            <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold' }}>새로운 카테고리 시작</Text>
            <Text style={{ color: colors.textPlaceholder, fontSize: 21, fontWeight: 'bold' }}>
              명확하고 간단한 단어를 입력하세요.
            </Text>
            <View style={{ flex: 1, width: 250, marginHorizontal: 40, alignItems: 'center' }}>
              <TextInput
                ref={inputRef}
                maxLength={12}
                style={{ fontSize: 30, width: '100%', fontWeight: 'bold', color: colors.text, textAlign: 'center' }}
                value={categoryValue}
                onChangeText={(text) => {
                  setCategoryValue(text.replace(/(\s*)/g, ''));
                }}
                placeholder={placeholderData[0]}
                placeholderTextColor={colors.textPlaceholder}
                returnKeyType="done"
                autoFocus
                onSubmitEditing={onAddCategory}
              />
              {!categoryValue &&
                placeholderData
                  .filter((item, index) => index > 0)
                  .map((item) => {
                    return (
                      <Text key={item} style={{ fontSize: 30, color: colors.textPlaceholder, fontWeight: 'bold' }}>
                        {item}
                      </Text>
                    );
                  })}
            </View>
          </View>
        </View>
      </Modal>
      <CategoryButton colors={colors} onAddPress={() => setIsOpenCategoryForm(true)} />
    </Modal>
  );
}

export default CategoryModal;
