import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Colors } from '@/utils/color.ts';

function PlusMinusButton({ isToggle, onPress, colors }: { isToggle: boolean; onPress: () => void; colors: Colors }) {
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handlePress = () => {
    rotation.value = withTiming(isToggle ? 0 : 90, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(isToggle ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
  };

  const beforeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -1.5 }, { rotate: `${rotation.value - 0}deg` }],
      opacity: opacity.value,
    };
  });

  const afterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -1.5 }, { rotate: `${rotation.value + 90}deg` }],
    };
  });

  return (
    <Pressable
      onPress={() => {
        onPress();
        handlePress();
      }}
      style={{ zIndex: 999, backgroundColor: colors.opposite, borderRadius: 999 }}
    >
      <View style={{ backgroundColor: colors.background, padding: 20, margin: 3, borderRadius: 999, zIndex: 99 }}>
        <View style={{ position: 'relative', width: 25, height: 25, cursor: 'pointer' }}>
          <Animated.View
            style={[
              {
                backgroundColor: colors.opposite,
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: 3,
              },
              beforeStyle,
            ]}
          />
          <Animated.View
            style={[
              {
                backgroundColor: colors.opposite,
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: 3,
              },
              afterStyle,
            ]}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default PlusMinusButton;
