import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/types';

export const ActionSheet = forwardRef((props, ref: ForwardedRef<BottomSheet>) => {
  const snapPoints = useMemo(() => ['20%'], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('handleSheetChange', index);
  }, []);

  return (
    <BottomSheet enableDynamicSizing ref={ref} snapPoints={snapPoints} onChange={handleSheetChange}>
      <BottomSheetView>
        <Text>Awesome 🔥</Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

export const ActionSheetModal = forwardRef((props, ref: ForwardedRef<BottomSheetModal>) => {
  const snapPoints = useMemo(() => ['20%'], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('handleSheetChange', index);
  }, []);

  return (
    <BottomSheetModal ref={ref} snapPoints={snapPoints} onChange={handleSheetChange}>
      <BottomSheetView>
        <Text>Awesome 🔥</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export const ActionSheetPopup = forwardRef(
  (props: Omit<BottomSheetProps, 'children'> & { children: React.ReactNode }, ref: ForwardedRef<BottomSheet>) => {
    const snapPoints = useMemo(() => props.snapPoints, [props.snapPoints]);

    const handleSheetChange = useCallback((index: number) => {
      console.log('handleSheetChange', index);
    }, []);

    return (
      <BottomSheet
        {...props}
        key="popup"
        detached
        bottomInset={46}
        ref={ref}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <View>{props.children}</View>
      </BottomSheet>
    );
  },
);
