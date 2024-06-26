import Theme from '@/components/Theme';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaView, StatusBar, View } from 'react-native';

import Home from '@/screens/Home';
import Note from '@/screens/Note';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const { colorScheme } = useColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Note" component={Note} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
