import { useColorScheme } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

const Theme = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-1 bg-white">
      <Pressable onPress={toggleColorScheme} className="flex-1 items-center justify-center bg-white">
        <Text className="text-black dark:text-white">hello</Text>
      </Pressable>
    </View>
  );
};

export default Theme;
