import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Providers from '@/components/Providers';
import Home from '@/screens/Home/Home.tsx';
import Note from '@/screens/Note';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Note" component={Note} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Providers>
  );
}
export default App;
