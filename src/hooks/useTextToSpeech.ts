import React from 'react';
import { Alert } from 'react-native';
import Tts, { TtsEvent } from 'react-native-tts';

let ttsStopTimeoutId: NodeJS.Timeout | null = null;
const useTextToSpeech = () => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [isPause, setIsPause] = React.useState<boolean>(false); // 일시정지 여부, 취소는 미포함
  const [playLocate, setPlayLocate] = React.useState<number>(0);

  // 음성읽기 시작
  const _play = (text: string) => {
    if (isLoaded) {
      if (ttsStopTimeoutId) clearTimeout(ttsStopTimeoutId);
      setIsPlaying(true);
      setIsPause(false);
      Tts.speak(text);
    } else {
      Alert.alert('음성 플레이어 준비 중 입니다. 잠시 후 다시 시도해 주세요.');
    }
  };
  const _pause = () => {
    Tts.pause();
    setIsPause(true);
  };
  const _resume = () => {
    Tts.resume();
    setIsPause(false);
  };
  const _stop = () => {
    Tts.stop();
    setIsPause(false);
    setIsPlaying(false);
  };
  const _cancel = () => {
    _stop();
    setPlayLocate(0);
  };
  const _finish = () => {
    setPlayLocate(0);
    setIsPlaying(false);
  };

  const handleProgress = (e: TtsEvent<'tts-progress'>) => {
    setPlayLocate(e.location);
  };

  React.useEffect(() => {
    Tts.getInitStatus().then(() => {
      setIsLoaded(true);
      Tts.setDucking(true);
      // Tts.setDefaultRate(0.3);
      Tts.addEventListener('tts-start', (event) => console.log('start', event));
      Tts.addEventListener('tts-progress', (e) => {
        handleProgress(e);
      });
      Tts.addEventListener('tts-finish', _finish);
      Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event));
    });
  }, []);
  return { _play, _pause, _resume, _stop, _cancel, playLocate, setPlayLocate, isPlaying, isPause };
};

export default useTextToSpeech;
