import { useColorScheme } from 'nativewind';
import React from 'react';

import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import Theme from './src/components/Theme';

function App(): React.JSX.Element {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-black dark:bg-white">
      <StatusBar barStyle={colorScheme === 'light' ? 'light-content' : 'dark-content'} />
      <View className="flex-1 items-center bg-black dark:bg-white">
        <Theme />
      </View>
    </SafeAreaView>
  );
}
export default App;
