import React from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Play, Pause, EllipsisVertical, Square, Fullscreen, Share2, Filter } from 'lucide-react-native';
import moment from 'moment';
import Share from 'react-native-share';

import useTextToSpeech from '@/hooks/useTextToSpeech';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
let autoHideOptionsTimeoutId: NodeJS.Timeout | null = null;

// 다음 작업
// - 필터모드에서 재생 중 일 떄 자동 문장 포커싱

const Note = () => {
  const insets = useSafeAreaInsets();
  const { _play, _pause, _resume, _stop, _cancel, playLocate, setPlayLocate, isPause, isPlaying } = useTextToSpeech();

  // 제목 인풋 상태값
  const [titleText, setTitleText] = React.useState<string>('');
  // 내용 인풋 상태값
  const [noteText, setNoteText] = React.useState<string>(aaa);
  // 작성일자
  const [wirteDate, setWriteDate] = React.useState<Date>(new Date());
  // 바텀 기본 메뉴 표시 여부
  const [showBottomMenu, setShowBottomMenu] = React.useState<boolean>(true);
  // 바텀 옵션 클릭시 메뉴 표시 여부
  const [showBottomptions, setShowBottomOptions] = React.useState<boolean>(false);
  // 제목,내용 인풋 포커싱 구분
  const [onFocusType, setOnFocusType] = React.useState<'TITLE' | 'NOTE'>('TITLE');
  // 스크롤 중인지 여부
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  // 포커스모드 여부
  const [isFocusMode, setIsFocusMode] = React.useState<boolean>(false);
  // 스크롤 터치 시작 시 y값
  const [scrollBeginY, setScrollBeginY] = React.useState<number>(0);
  // 스크롤 터치 종료 시 y값
  const [scrollEndY, setScrollEndY] = React.useState<number>(0);
  // 필터모드 활성 여부
  const [isOnFilterMode, setIsOnFilterMode] = React.useState<boolean>(false);
  // 필터모드 중 활성화된 문장 인덱스
  const [selectedSentenceIndex, setSelectedSentenceIndex] = React.useState<number>(0);
  // 탑 패딩 값
  const headerPaddingValue = useSharedValue(insets.top);
  // 바텀 기본 메뉴 투명도값
  const bottomMenuTop = useSharedValue(110);
  // 바텀 옵션 클릭시 메뉴 투명도값
  const bottomOptionTop = useSharedValue(110);
  // 바텀 기본 메뉴 투명도값
  const heightValue = useSharedValue(0);

  // . 단위로 문장 배열화
  const formatSentenceArr = React.useCallback((text: string) => {
    return text
      .split('.')
      .filter((n) => n.length > 0)
      .map((n) => `${n}. `);
  }, []);
  // 필터모드에서 선택된 인덱스 부터의 노트값
  const formatFromSelectNote = React.useCallback((text: string[], index: number) => {
    return text.filter((n, _i) => _i >= index).join('');
  }, []);

  // 필터모드에서 선택한 텍스트 아이템 이후의 값만 저장, 해당 부분부터 재생되도록
  const formatFromSelectSentence = (index: number) => {
    return formatFromSelectNote(formatSentenceArr(noteText), index);
  };

  // 제목 인풋 값 변경
  const handleTitleInput = (text: string) => {
    setTitleText(text);
    _cancel();
  };

  // 내용 인풋 값 변경
  const handleNoteInput = (text: string) => {
    setNoteText(text);
    _cancel();
  };

  // 옵션 메뉴들 활성화
  const activeBottomMenuOptions = () => {
    setShowBottomMenu(false);
    setTimeout(() => {
      setShowBottomOptions(true);
    }, 400);
  };

  // 옵션 메뉴들 3초후 비활성화
  const unActiveBottomMenuOptions = () => {
    autoHideOptionsTimeoutId = setTimeout(() => {
      setShowBottomOptions(false);
      setTimeout(() => {
        setShowBottomMenu(true);
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
    if (isPlaying && !isPause) {
      _pause();
    } else {
      if (noteText.length > 0) {
        if (isPause) {
          _resume();
        } else {
          _stop();
          setTimeout(() => {
            _play(formatFromSelectSentence(selectedSentenceIndex));
          }, 100);
        }
      } else {
        Alert.alert('내용을 입력해 주세요');
      }
    }
  };

  // 완전 정지, 초기화
  const onCancel = () => {
    _cancel();
    setSelectedSentenceIndex(0);
  };

  // 컴포넌트 표시
  const show_KAC = React.useCallback(() => {
    heightValue.value = withDelay(150, withTiming(40, { duration: 200 }));
  }, []);

  // 컴포넌트 숨기기
  const hide_KAC = React.useCallback(() => {
    heightValue.value = 0;
  }, []);

  // 포커스 모드 전환
  const handleFocusMode = React.useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, [isFocusMode]);

  // 현재 재생중인 위치의 인덱스 추출
  const getCurrentIndex = () => {
    // 내용 처음부터 현재 읽고 있는 글자까지
    const beforeDot = noteText.slice(0, playLocate + 1);
    // 현재 읽고 있는 글자부터 마지막 내용까지
    const afterDot = noteText.slice(playLocate + 1);
    const specificKey = `🙉SimpleIsbest🙈`;
    // 현재 재생중인 위치에 특수 문자 삽입
    const formatNote = `${beforeDot}${specificKey}${afterDot}`;
    let playingSentenceIndex = 0;
    const formatArr = formatSentenceArr(formatNote);
    // 특수문자를 포함하고 있는 곳의 인덱스 추출하여
    formatArr.some((sentence, _i) => {
      if (sentence.includes(specificKey)) {
        playingSentenceIndex = _i;
        return true;
      }
    });
    return playingSentenceIndex;
  };

  // 필터 모드 전환
  const handleFilterMode = () => {
    setIsOnFilterMode((prev) => !prev);
    // 필터모드가 활성화된 경우
    if (!isOnFilterMode) {
      // 재생 중이거나 일시 정지된 경우
      if (playLocate > 0) {
        // 해당 인덱스로 포커싱
        setSelectedSentenceIndex(getCurrentIndex());
      }
    }
  };

  // 공유 버튼 클릭
  const openShare = () => {
    Share.open({
      title: titleText,
      message: `${titleText} - ${noteText}`,
      showAppsToView: true,
    });
  };

  // 필터모드 시 텍스트 아이템 클릭
  const pressFilteredTextItem = (index: number) => {
    setSelectedSentenceIndex(index);
    // 재생 중에 인덱스가 변경됐다면 해당 인덱스부터 재생
    if (isPlaying && !isPause) {
      // 필터모드에서 선택한 텍스트 아이템 이후의 값만 저장, 해당 부분부터 재생되도록
      const formatText = formatFromSelectSentence(index);
      _stop();
      setTimeout(() => {
        _play(formatText);
      }, 100);
    } else {
      _stop();
    }
  };

  const titleInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerPaddingValue.value,
    };
  });
  const bottomMenuAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: `${bottomMenuTop.value}%`,
    };
  });
  const bottomOptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: `${bottomOptionTop.value}%`,
    };
  });

  const heightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
    };
  });

  React.useEffect(() => {
    return () => {
      // 옵션메뉴 활성화 타임아웃 제거
      if (autoHideOptionsTimeoutId) clearTimeout(autoHideOptionsTimeoutId);
    };
  }, []);

  // 기본 바템메뉴 토글 (재생,정지,제목 등)
  React.useEffect(() => {
    if (showBottomMenu) {
      bottomMenuTop.value = withTiming(87, { duration: 400 });
    } else {
      bottomMenuTop.value = withTiming(110);
    }
  }, [showBottomMenu]);

  // 옵션 바템메뉴 토글 (필터,공유,포커스)
  React.useEffect(() => {
    if (showBottomptions) {
      bottomOptionTop.value = withTiming(87, { duration: 400 });
    } else {
      bottomOptionTop.value = withTiming(110);
    }
  }, [showBottomptions]);

  // 키보드 토글 시 키보드컴포넌트 토글
  React.useEffect(() => {
    Keyboard.addListener('keyboardWillShow', show_KAC);
    Keyboard.addListener('keyboardWillHide', hide_KAC);
  }, []);

  // 포커스 모드 토글 시 처리
  React.useEffect(() => {
    if (isFocusMode) {
      headerPaddingValue.value = withTiming(0, { duration: 400 });
      StatusBar.setHidden(true, 'fade');
      if (autoHideOptionsTimeoutId) clearTimeout(autoHideOptionsTimeoutId);
      setShowBottomMenu(false);
      setShowBottomOptions(false);
    } else {
      headerPaddingValue.value = withTiming(insets.top, { duration: 400 });
      StatusBar.setHidden(false, 'fade');
      setShowBottomMenu(true);
    }
  }, [isFocusMode]);

  // 스크롤 터치 종료 시, 터치 시작 값보다 높으면 포커스모드 실행
  React.useEffect(() => {
    if (scrollBeginY < scrollEndY && !isFocusMode) {
      setIsFocusMode(true);
    }
    if (scrollBeginY > scrollEndY && isFocusMode) {
      setIsFocusMode(false);
    }
  }, [scrollEndY]);

  // 필터모드에서 재생 시 문장 바뀌면 필터링 처리
  React.useEffect(() => {
    // setSelectedSentenceIndex(getCurrentIndex());
  }, [playLocate]);

  const titleInputRef = React.useRef<TextInput>(null);
  const noteInputRef = React.useRef<TextInput>(null);

  const filteredNoteTextArr = React.useCallback(() => {
    return noteText
      .split('.')
      .filter((n) => n.length > 0)
      .map((n) => `${n}.`);
  }, [isFocusMode, noteText]);

  return (
    <View style={{ position: 'relative', flex: 1, width: '100%', height: '100%' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        <Animated.View style={titleInputAnimatedStyle} />
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          onScrollBeginDrag={(e) => {
            setIsScrolling(true);
            setScrollBeginY(e.nativeEvent.contentOffset.y);
          }}
          onScrollEndDrag={(e) => {
            setIsScrolling(false);
            setScrollEndY(e.nativeEvent.contentOffset.y);
          }}
          onMomentumScrollEnd={(e) => {
            setIsScrolling(false);
          }}
        >
          <Animated.View style={{ flex: 1 }}>
            <Animated.View style={{ borderBottomWidth: 1, borderBottomColor: '#999' }}>
              <TextInput
                ref={titleInputRef}
                placeholder="제목..."
                value={titleText}
                onChangeText={handleTitleInput}
                onFocus={() => {
                  setOnFocusType('TITLE');
                }}
                editable={!isPlaying}
                style={{ paddingHorizontal: '5%', paddingVertical: '5%', fontSize: 24 }}
              />
            </Animated.View>
            <View style={{}}>
              {isOnFilterMode ? (
                <View style={{ padding: '5%' }}>
                  <Text>
                    {filteredNoteTextArr().map((noteArr, _i) => {
                      const isSelected = selectedSentenceIndex === _i;
                      return (
                        <Text
                          key={`${_i}_${noteArr}`}
                          onPress={() => pressFilteredTextItem(_i)}
                          style={{ color: isSelected ? 'black' : '#ddd', fontSize: 18 }}
                        >
                          {noteArr}
                        </Text>
                      );
                    })}
                  </Text>
                </View>
              ) : (
                <TextInput
                  ref={noteInputRef}
                  placeholder="내용..."
                  value={noteText}
                  multiline
                  onChangeText={handleNoteInput}
                  textAlignVertical="top"
                  onFocus={() => {
                    setOnFocusType('NOTE');
                  }}
                  editable={!isScrolling}
                  scrollEnabled={false}
                  style={{ padding: '5%', paddingBottom: SCREEN_HEIGHT / 3, fontSize: 18 }}
                />
              )}
            </View>
          </Animated.View>
        </ScrollView>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'black',
            },
            heightAnimatedStyle,
          ]}
        >
          <View
            style={{
              flex: 1,
              height: '100%',
              flexDirection: 'row',
            }}
          >
            {onFocusType === 'NOTE' && (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <ScrollView
                  horizontal
                  style={{ width: '100%', height: '100%' }}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                  keyboardShouldPersistTaps={'always'}
                >
                  <TouchableOpacity style={{ paddingHorizontal: 5, justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>마이크</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingHorizontal: 5, justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>텍스트컬러</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingHorizontal: 5, justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>구분선</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>
          <View
            style={{
              height: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              borderLeftWidth: 0.5,
              borderLeftColor: 'white',
            }}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 10, height: '100%', justifyContent: 'center' }}
              onPress={Keyboard.dismiss}
            >
              <Text style={{ color: 'white' }}>완료</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: '5%',
            right: '5%',
            height: 70,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: 14,
            backgroundColor: 'black',
            gap: 10,
          },
          bottomMenuAnimatedStyle,
        ]}
      >
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
            {isPlaying && !isPause ? <Pause size={30} color={'black'} /> : <Play size={28} color={'black'} />}
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onCancel}>
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
            <Square size={24} color={'black'} fill={'black'} />
          </View>
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, justifyContent: 'space-around' }}>
          <Text style={{ color: 'white', fontSize: 23 }} numberOfLines={1}>
            {titleText}
          </Text>
          <Text style={{ color: '#999' }} numberOfLines={1}>
            {moment(wirteDate).format('YYYY.MM.DD')} / {noteText}
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={clickShowOptions}>
          <View
            style={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
          >
            <EllipsisVertical size={28} color={'white'} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: '5%',
            right: '5%',
            height: 70,
            padding: 10,
            flexDirection: 'row',
            borderRadius: 14,
            backgroundColor: 'black',
            gap: 10,
          },
          bottomOptionAnimatedStyle,
        ]}
      >
        <TouchableWithoutFeedback onPress={handleFilterMode}>
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
            <Filter size={26} color={'black'} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={openShare}>
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
            <Share2 size={26} color={'black'} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleFocusMode}>
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
            <Fullscreen size={26} color={'black'} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default Note;

const aaa = `일이삼사오육칠팔구십.십일십이심삽십사십오 십육십칠십팔십구이십. 이십일 이십이 이십삼 이십사 이십오 이십육 이십칠 이십팔 이십구 삼십. 삼십일삼십이삼심삼삼십사삼십오삼십육삼십칠삼십팔삼십구사십. 사십일 사십이 사십삼 사십사 사십오 사십육 사십칠 사십팔 사십구 오십. 오십일오십이오십삼오십사오십오오십육오십칠오십팔오십구육십. 육십일 육십이 육십삼 육십사 육십오 육십육 육십칠 육십팔 육십구 칠십`;
