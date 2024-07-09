import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

function Icon({ style, onPress, icon }: { style?: StyleProp<ViewStyle>; onPress?: () => void; icon: React.ReactNode }) {
  return (
    <Pressable
      style={[
        {
          width: 32,
          height: 32,
          marginHorizontal: 2,
          marginVertical: 4,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon}
    </Pressable>
  );
}

export default Icon;
