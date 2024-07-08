import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/core';
import { Mic, PencilLine } from 'lucide-react-native';

import PlusMinusButton from '@/components/PlusMinusButton.tsx';
import { Colors } from '@/utils/color.ts';

function HomeButton({ colors, isHidden }: { colors: Colors; isHidden: boolean }) {
  const navigation = useNavigation<any>();

  const [isToggle, setIsToggle] = useState<boolean>(false);

  // 사이드 버튼 오프셋
  const leftButtonOffset = useSharedValue(-10);
  const rightButtonOffset = useSharedValue(10);

  // 사이드 버튼 너비
  const leftButtonWidth = useSharedValue(25);
  const rightButtonWidth = useSharedValue(25);

  const mainButtonBottom = useSharedValue(30);

  // 사이드 버튼 토글 애니메이션
  const onToggleSideButton = () => {
    if (!isToggle) {
      leftButtonOffset.value = withTiming(-100, { duration: 500, easing: Easing.out(Easing.exp) });
      rightButtonOffset.value = withTiming(100, { duration: 500, easing: Easing.out(Easing.exp) });
      leftButtonWidth.value = withTiming(100, { duration: 500, easing: Easing.out(Easing.exp) });
      rightButtonWidth.value = withTiming(100, { duration: 500, easing: Easing.out(Easing.exp) });
    } else {
      leftButtonOffset.value = withTiming(-25, { duration: 500, easing: Easing.out(Easing.exp) });
      rightButtonOffset.value = withTiming(25, { duration: 500, easing: Easing.out(Easing.exp) });
      leftButtonWidth.value = withTiming(25, { duration: 500, easing: Easing.out(Easing.exp) });
      rightButtonWidth.value = withTiming(25, { duration: 500, easing: Easing.out(Easing.exp) });
    }

    setIsToggle(!isToggle);
  };

  // 사이드 버튼 숨기기 애니메이션
  const onHiddenSideButton = () => {
    if (isHidden) {
      mainButtonBottom.value = withTiming(-100, { duration: 800, easing: Easing.out(Easing.exp) });
    } else {
      mainButtonBottom.value = withTiming(30, { duration: 800, easing: Easing.out(Easing.exp) });
    }
  };

  const mainButtonStyle = useAnimatedStyle(() => ({
    bottom: mainButtonBottom.value,
  }));

  const leftButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftButtonOffset.value }],
    width: leftButtonWidth.value,
  }));

  const rightButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightButtonOffset.value }],
    width: rightButtonWidth.value,
  }));

  useEffect(() => {
    onHiddenSideButton();
  }, [isHidden]);

  return (
    <Animated.View
      style={[
        {
          marginHorizontal: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
        },
        mainButtonStyle,
      ]}
    >
      <PlusMinusButton colors={colors} isToggle={isToggle} onPress={onToggleSideButton} />
      <Animated.View
        style={[
          {
            backgroundColor: colors.opposite,
            position: 'absolute',
            borderRadius: 10,
            left: '50%',
            padding: 3,
          },
          leftButtonStyle,
        ]}
      >
        <Pressable
          onPress={() => navigation.navigate('Note')}
          style={{ width: '100%', borderRadius: 10, backgroundColor: colors.background, padding: 15 }}
        >
          <Mic size={21} color={colors.text} />
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[
          {
            backgroundColor: colors.opposite,
            borderRadius: 10,
            position: 'absolute',
            right: '50%',
            padding: 3,
          },
          rightButtonStyle,
        ]}
      >
        <View
          style={{
            width: '100%',
            borderRadius: 10,
            alignItems: 'flex-end',
            backgroundColor: colors.background,
            padding: 15,
          }}
        >
          <PencilLine size={21} color={colors.text} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default HomeButton;
