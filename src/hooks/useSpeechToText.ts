import { useEffect, useState } from 'react';
import Voice from 'react-native-voice';

const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const onSpeechStart = () => {
    console.log('onSpeechStart');
    setText('');
  };
  const onSpeechEnd = () => {
    console.log('onSpeechEnd');
  };
  const onSpeechResults = (event) => {
    console.log('onSpeechResults');
    setText(event.value[0]);
  };
  const onSpeechError = (event) => {
    console.log('_onSpeechError');
    console.log(event.error);
  };

  const onSpeechToText = () => {
    if (isRecording) {
      Voice.stop();
    } else {
      Voice.start('ko-KR');
    }
    setIsRecording(!isRecording);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return { text, isRecording, onSpeechToText };
};

export default useSpeechToText;
