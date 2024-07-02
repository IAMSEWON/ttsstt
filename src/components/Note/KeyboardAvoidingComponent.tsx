import React, { PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

interface IProps extends PropsWithChildren {
  visible: boolean;
  inputType: 'TITLE' | 'NOTE';
}

const KeyboardAvoidingComponent = ({ children, visible, inputType }: IProps) => {
  // 바텀 기본 메뉴 투명도값
  const heightValue = useSharedValue(0);

  // 컴포넌트 표시
  const show_KAC = () => {
    heightValue.value = withDelay(150, withTiming(40, { duration: 200 }));
  };

  // 컴포넌트 숨기기
  const hide_KAC = () => {
    heightValue.value = 0;
  };

  React.useEffect(() => {
    Keyboard.addListener('keyboardWillShow', show_KAC);
    Keyboard.addListener('keyboardWillHide', hide_KAC);
  }, []);

  const heightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    };
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'black',
          },
          heightAnimatedStyle,
        ]}
      >
        <View
          style={{
            flex: 1,
            height: '100%',
            flexDirection: 'row',
          }}
        >
          {inputType === 'NOTE' && <>{children}</>}
        </View>
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            borderLeftWidth: 0.5,
            borderLeftColor: 'white',
          }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 10, height: '100%', justifyContent: 'center' }}
            onPress={Keyboard.dismiss}
          >
            <Text style={{ color: 'white' }}>완료</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingComponent;
