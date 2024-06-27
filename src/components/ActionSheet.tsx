import React, { ForwardedRef, forwardRef, useCallback, useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from 'react-native';

export const ActionSheet = forwardRef((props, ref:ForwardedRef<BottomSheet>) => {

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('handleSheetChange', index);
  }, []);

  return (
    <BottomSheet ref={ref} snapPoints={snapPoints} onChange={handleSheetChange}>
      <BottomSheetView>
        <Text>Awesome 🔥</Text>
      </BottomSheetView>
    </BottomSheet>
  );
});
