import React from 'react';
import { Alert } from 'react-native';
import Tts, { TtsEvent } from 'react-native-tts';

const useTextToSpeech = () => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false); // 플레이 여부(일시정지도 플레이true)
  const [isPause, setIsPause] = React.useState<boolean>(false); // 일시정지 여부, 취소는 미포함
  const [isStop, setIsStop] = React.useState<boolean>(false); // 취소 여부
  // 문장단위 종료여부
  const [isFinish, setIsFinish] = React.useState<boolean>(false);

  // 음성읽기 시작
  const _play = (text: string) => {
    if (isLoaded) {
      setIsPlaying(true);
      setIsPause(false);
      setIsStop(false);
      setIsFinish(false);
      Tts.speak(text);
    } else {
      Alert.alert('음성 플레이어 준비 중 입니다. 잠시 후 다시 시도해 주세요.');
    }
  };
  // 일시정지
  const _pause = () => {
    Tts.pause();
    setIsPause(true);
  };
  // 일시정지 재생
  const _resume = () => {
    Tts.resume();
    setIsPause(false);
  };
  // 재생 초기화
  const _stop = () => {
    Tts.stop();
    setIsStop(true);
    setIsPause(false);
    setIsPlaying(false);
  };
  // play(parameter) parameter값 플레이 완료
  const _finish = () => {
    setIsFinish(true);
  };

  React.useEffect(() => {
    Tts.getInitStatus().then(() => {
      // 음성 엔진 준비 완료
      setIsLoaded(true);
      Tts.setDucking(true);
      Tts.addEventListener('tts-finish', _finish);

      return () => {
        Tts.removeEventListener('tts-finish', _finish);
      };
    });
  }, []);
  return { _play, _pause, _resume, _stop, isFinish, isStop, isPlaying, isPause };
};

export default useTextToSpeech;
