import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useThemeContext from '@/hooks/useThemeContext.ts';

function Layout({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
  const { colors } = useThemeContext();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: top, paddingHorizontal: 10 }}>
      <View>{header}</View>
      {children}
    </View>
  );
}

export default Layout;
