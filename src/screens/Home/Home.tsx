import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeContext from '@/hooks/useThemeContext.ts';
import CategoryHeader from '@/screens/Home/CategoryHeader.tsx';
import CategoryModal from '@/screens/Home/CategoryModal.tsx';
import { Category } from '@/types/category.ts';
import { getData } from '@/utils/storage.ts';

function Home() {
  const { top } = useSafeAreaInsets();
  const [categorys, setCategorys] = useState<Category[]>([]);

  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  const { colors } = useThemeContext();

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
        <CategoryHeader onOpenCategory={() => setIsOpenCategory(true)} />
        <CategoryModal
          open={isOpenCategory}
          setOpen={setIsOpenCategory}
          setCategorys={setCategorys}
          categorys={categorys}
        />
      </View>
    </SafeAreaView>
  );
}
export default Home;
