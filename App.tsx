import Theme from '@/components/Theme';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from '@/screens/Home';
import Note from '@/screens/Note';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Note">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Note" component={Note} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
