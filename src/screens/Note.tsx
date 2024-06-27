import React from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Tts from 'react-native-tts';

import useTextToSpeech from '@/hooks/useTextToSpeech';

const Note = () => {
  const insets = useSafeAreaInsets();
  const {_play, _pause, _resume, _cancel, currentLocate, isPlaying
    ,handlePlaying} = useTextToSpeech()

  const [titleText, setTitleText] = React.useState<string>('');
  const [noteText, setNoteText] = React.useState<string>('On some platforms it could take some time to initialize TTS engine, and Tts.speak() will fail to speak until the engine is ready.');
  const [showBottomMenu, setShowBottomMenu] = React.useState<boolean>(true);
  const [showBottomptions, setShowBottomOptions] = React.useState<boolean>(false);
  const bottomMenuOpacity = useSharedValue(1);
  const bottomOptionOpacity = useSharedValue(0.5);

  const handleTitleInput = (text: string) => {
    setTitleText(text);
  };

  const handleNoteInput = (text: string) => {
    setNoteText(text);
  };

  // 옵션 메뉴들 활성화
  const activeBottomMenuOptions = () => {
    setShowBottomOptions(true);
    bottomOptionOpacity.value = withTiming(1, { duration: 300 });
    bottomMenuOpacity.value = withTiming(0, { duration: 400 });
    setTimeout(() => {
      setShowBottomMenu(false);
    }, 300);
  };
  let autoHideOptionsTimeoutId: NodeJS.Timeout | null = null;
  // 옵션 메뉴들 비활성화
  const unActiveBottomMenuOptions = () => {
    autoHideOptionsTimeoutId = setTimeout(() => {
      setShowBottomMenu(true);
      bottomMenuOpacity.value = withTiming(1, { duration: 400 });
      bottomOptionOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        setShowBottomOptions(false);
      }, 400);
    }, 3000);
  };

  // 바텀메뉴 옵션버튼 클릭
  const clickShowOptions = () => {
    activeBottomMenuOptions();
    unActiveBottomMenuOptions();
  };

  // 재생/정지 상태값 변경
  const togglePlay = () => {
    if (isPlaying) {
      handlePlaying(false);
      _pause();
    } else {
      handlePlaying(true);
      if (noteText.length > 0) {
        if (currentLocate === 0){
          _play(noteText);
        } else {
          _resume();
        }
      } else {
        Alert.alert('내용을 입력해 주세요');
      }
    }
  };

  const bottomMenuAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomMenuOpacity.value,
    };
  });
  const bottomOptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomOptionOpacity.value,
    };
  });
  

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ScrollView
        keyboardDismissMode={'on-drag'}
        onScroll={(e) => {
          // console.log('e.nativeEvent', e.nativeEvent);
          // scrollOffsetValue.value = e.nativeEvent.contentOffset.y;
        }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#999' }}>
            <TextInput
              placeholder="제목..."
              value={titleText}
              onChangeText={handleTitleInput}
              style={{ paddingHorizontal: '5%', paddingVertical: '5%', fontSize: 24 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              value={noteText}
              onChangeText={handleNoteInput}
              multiline
              style={{ flex: 1, padding: '5%', backgroundColor: '#ccc' }}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          {
            position: 'absolute',
            bottom: insets.bottom + 10,
            left: '5%',
            right: '5%',
            height: 70,
            borderRadius: 14,
            backgroundColor: 'black',
          },
        ]}
      >
        {showBottomptions && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 10,
                width: '100%',
                flexDirection: 'row',
                gap: 10,
              },
              bottomOptionAnimatedStyle,
            ]}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('.,;필터');
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}
              >
                <Text>.,;필터</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('공유');
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}
              >
                <Text>공유</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                console.log('포커스');
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'white',
                }}
              >
                <Text>포커스</Text>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        )}
        {showBottomMenu && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 10,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 14,
                backgroundColor: 'black',
              },
              bottomMenuAnimatedStyle,
            ]}
          >
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableWithoutFeedback onPress={togglePlay}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    backgroundColor: 'white',
                  }}
                >
                  <Text>{isPlaying ? '일시정지': '재생'}</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={_cancel}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    backgroundColor: 'white',
                  }}
                >
                  <Text>취소</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <TouchableWithoutFeedback onPress={clickShowOptions}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    backgroundColor: 'white',
                  }}
                >
                  <Text>옵션</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default Note;
