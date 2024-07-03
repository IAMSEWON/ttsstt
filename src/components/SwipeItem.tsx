import React, { ForwardedRef, forwardRef, useState } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

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
              borderBottomColor: 'white',
              paddingVertical: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>{value}</Text>
          {icon || (
            <View
              style={{
                backgroundColor: 'white',
                width: 24,
                height: 24,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{ width: 16, height: 16, backgroundColor: check ? 'black' : 'transparent' }} />
            </View>
          )}
        </View>
      </Swipeable>
    );
  },
);

export default SwipeItem;
