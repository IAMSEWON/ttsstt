import React, { ForwardedRef, forwardRef, useState } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Check } from 'lucide-react-native';

import useThemeContext from '@/hooks/useThemeContext.ts';

const SwipeItem = forwardRef(
  (
    {
      value,
      drag,
      check = false,
      leftSide,
      rightSide,
      style,
      icon,
    }: {
      value: string;
      drag?: boolean;
      check?: boolean;
      icon?: React.ReactNode;
      leftSide?: React.ReactNode;
      rightSide?: React.ReactNode;
      style?: StyleProp<ViewStyle>;
    },
    ref: ForwardedRef<Swipeable>,
  ) => {
    const { colors, colorTheme } = useThemeContext();

    const [isSwipe, setIsSwipe] = useState<'left' | 'right' | 'default'>('default');

    return (
      <Swipeable
        ref={ref}
        onSwipeableOpen={(direction) => setIsSwipe(direction)}
        onSwipeableClose={() => setIsSwipe('default')}
        overshootLeft={false}
        overshootRight={false}
        renderLeftActions={() => {
          if (drag) {
            return false;
          }
          return leftSide && leftSide;
        }}
        renderRightActions={() => {
          if (drag) {
            return false;
          }

          return rightSide && rightSide;
        }}
      >
        <View
          style={[
            style,
            {
              borderBottomWidth: 1,
              borderBottomColor: colors.textPlaceholder,
              paddingVertical: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>{value}</Text>
          {icon || (
            <View
              style={{
                backgroundColor: check ? colors.text : 'transparent',
                width: 24,
                height: 24,
                marginRight: 10,
                padding: 4,
                borderRadius: 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={17} fontWeight="bold" color={check ? colors.background : 'transparent'} />
            </View>
          )}
        </View>
      </Swipeable>
    );
  },
);

export default SwipeItem;
