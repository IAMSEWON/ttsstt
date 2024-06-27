import useSpeechToText from '@/hooks/useSpeechToText';
import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import Voice from 'react-native-voice';

const Home = () => {
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
    </View>
  );
};

export default Home;
