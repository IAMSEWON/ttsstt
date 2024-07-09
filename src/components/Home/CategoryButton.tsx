import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';

import { Colors } from '@/utils/color.ts';

function CategoryButton({ colors, onAddPress }: { colors: Colors; onAddPress: () => void }) {
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 30,
          backgroundColor: colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          shadowRadius: 5,
          shadowOpacity: 0.1,
          shadowColor: colors.opposite,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          flexDirection: 'row',
          gap: 2,
          width: 50,
          padding: 2,
          borderRadius: 100,
          left: '50%',
          transform: [{ translateX: -25 }],
        },
      ]}
    >
      <Pressable
        onPress={onAddPress}
        style={{
          width: 50,
          height: 50,
          borderRadius: 100,
          backgroundColor: colors.opposite,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Plus size={17} />
      </Pressable>
    </Animated.View>
  );
}

export default CategoryButton;
