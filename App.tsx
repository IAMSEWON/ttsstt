import React from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Providers from '@/components/Providers';
import Home from '@/screens/Home/Home';
import Note from '@/screens/Note';
import Permission from '@/screens/Permission';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <Providers>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Permission" component={Permission} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Note" component={Note} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Providers>
  );
}
export default App;
