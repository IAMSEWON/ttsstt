import React, { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme } from '@react-navigation/native';

import ThemeProvider from './ThemeProvider';

function Providers({ children }: { children: ReactNode }) {
  console.log('🔥🔥Providers/Providers :10 - DefaultTheme = ', DefaultTheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
export default Providers;
