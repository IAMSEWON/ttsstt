import React from 'react';
import { Alert } from 'react-native';
import Tts, { TtsEventHandler } from 'react-native-tts';

const useTextToSpeech = () => {

    const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [currentLocate, setCurrentLocate] = React.useState<number>(0);

    // 음성읽기 시작
    const _play = (text: string) => {
        if (isLoaded){
            Tts.speak(text)
        } else {
            Alert.alert('음성 플레이어 준비 중 입니다. 잠시 후 다시 시도해 주세요.')
        }
    }
    const _pause = () => {
        Tts.pause()
    }
    const _resume = () => {
        Tts.resume()
    }
    const _cancel = () => {
        Tts.stop()
        setCurrentLocate(0)
        setIsPlaying(false);
    }

    // 음성 재생 토글
    const handlePlaying = (play: boolean) => {
        setIsPlaying(play)
    }
    const handleProgress = (location: number) => {
        setCurrentLocate(location)
    }

    React.useEffect(() => {
        Tts.getInitStatus().then(() => {
            setIsLoaded(true)
            Tts.addEventListener('tts-start', (event) => console.log("start", event));
          Tts.addEventListener('tts-progress', (e) => {
            handleProgress(e.location)
          });
          Tts.addEventListener('tts-finish', _cancel);
          Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
          });
    }, [])
    return {_play, _pause, _resume, _cancel, currentLocate, isPlaying
        ,handlePlaying}
}

export default useTextToSpeech;