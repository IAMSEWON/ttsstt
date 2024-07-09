import React, { useEffect, useState } from 'react';

import CategoryHeader from '@/components/Home/CategoryHeader.tsx';
import CategoryList from '@/components/Home/CategoryList.tsx';
import CategoryModal from '@/components/Home/CategoryModal.tsx';
import Layout from '@/components/Layout.tsx';
import { CategoryGroupType, CategoryListType } from '@/types/category.ts';
import { getData } from '@/utils/storage.ts';

function Home() {
  // 현재 카테고리 페이지
  const [page, setPage] = useState<number>(0);

  const [categorys, setCategorys] = useState<CategoryGroupType[]>([]);

  const [selectedCategoryList, setSelectedCategoryList] = useState<CategoryListType[]>([]);

  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  // 초기화 함수
  const init = async () => {
    const categorysStorage: CategoryGroupType[] | null = await getData('categorys');

    if (!categorysStorage) return;

    setCategorys(categorysStorage);
  };

  useEffect(() => {
    setSelectedCategoryList(categorys[page]?.list || []);
  }, [categorys, page]);

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout
      header={
        <CategoryHeader
          onOpenCategory={() => setIsOpenCategory(true)}
          categorys={categorys}
          page={page}
          setPage={setPage}
        />
      }
    >
      <CategoryList list={selectedCategoryList} />
      <CategoryModal
        open={isOpenCategory}
        setOpen={setIsOpenCategory}
        setCategorys={setCategorys}
        categorys={categorys}
      />
    </Layout>
  );
}
export default Home;
