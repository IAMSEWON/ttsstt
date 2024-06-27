import { ActionSheet } from '@/components/ActionSheet';
import useSpeechToText from '@/hooks/useSpeechToText';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Text, View } from 'react-native';

const Home = () => {
  const sheetRef = useRef<BottomSheet>(null);


  const { text, isRecording, onSpeechToText } = useSpeechToText();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>{text}</Text>
      <Button onPress={onSpeechToText} title={isRecording ? 'loading' : 'hello'} />
      <ActionSheet ref={sheetRef} />
    </View>
  );
};

export default Home;
