import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

import useThemeContext from '@/hooks/useThemeContext.ts';
import CategoryHeader from '@/screens/Home/CategoryHeader.tsx';
import CategoryModal from '@/screens/Home/CategoryModal.tsx';
import { Category } from '@/types/category.ts';
import { getData } from '@/utils/storage.ts';

function Home() {
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
      <CategoryHeader onOpenCategory={() => setIsOpenCategory(true)} categorys={categorys} />
      <CategoryModal
        open={isOpenCategory}
        setOpen={setIsOpenCategory}
        setCategorys={setCategorys}
        categorys={categorys}
      />
    </SafeAreaView>
  );
}
export default Home;
