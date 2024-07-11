import React from 'react';

import Layout from '@/components/Layout.tsx';
import PermissionCarousel from '@/components/Permission/PermissionCarousel.tsx';
import { PermissionType } from '@/types/permission.tsx';

const PermissionData: PermissionType[] = [
  {
    id: 0,
    title: '음성 인식',
    description: '음성 인식을 위해 마이크에 접근합니다.',
  },
  {
    id: 1,
    title: '사진',
    description: '사진을 노트에 추가하기 위해 카메라에 접근합니다.',
  },
];

function Permission() {
  return (
    <Layout>
      <PermissionCarousel
        data={PermissionData}
        onSelectItem={(index) => console.log('🔥🔥Permission/ :10 - index = ', index)}
      />
    </Layout>
  );
}

export default Permission;
