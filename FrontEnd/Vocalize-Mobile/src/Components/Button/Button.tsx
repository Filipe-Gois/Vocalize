import {
  Pressable,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Theme } from "../../Theme/Theme";
import { useEffect, useRef } from "react";
import { BackgroundImageButton, ButtonBox } from "./style";
import { Audio } from "expo-av";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// import BackgroundGreen from "../../Assets/backgroundGreen.png";
// import BackgroundPink from "../../Assets/backgroundPink.png";

type ButtonProps = TouchableOpacityProps & {
  isSpeechToText: boolean;
  recordingFileUri: string | null;
  isRecording: boolean;
  // buttonRef: React.RefObject<TouchableOpacity> | null;
};
//simplificar essa lógica depois :(
const Button = ({
  isSpeechToText,
  recordingFileUri,
  isRecording,
  ...rest
}: ButtonProps) => {
  const animation = useSharedValue(1);
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(animation.value, { duration: 1000 }),
        },
      ],
    };
  });

  if (isSpeechToText) {
    return (
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,

          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 50,
          marginTop: 35,
          backgroundColor: isSpeechToText
            ? Theme.colors.pink.v1
            : Theme.colors.green.v1,
        }}
        {...rest}
      >
        <Animated.View style={[animationStyle]}>
          {isSpeechToText ? (
            <Feather name="mic" size={30} color="white" />
          ) : (
            <AntDesign name="sound" size={30} color="white" />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  } else if (!isSpeechToText && recordingFileUri) {
    return (
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,

          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 50,
          marginTop: 35,
          backgroundColor: isSpeechToText
            ? Theme.colors.pink.v1
            : Theme.colors.green.v1,
        }}
        {...rest}
      >
        {isSpeechToText ? (
          <Feather name="mic" size={30} color="white" />
        ) : (
          <AntDesign name="sound" size={30} color="white" />
        )}
      </TouchableOpacity>
    );
  }
};

const ButtonBoxComponent = ({
  isSpeechToText,
  recordingFileUri,
  isRecording,
  ...rest
}: ButtonProps) => {
  useEffect(() => {}, [isRecording]);
  return (
    <BackgroundImageButton
      source={
        isSpeechToText
          ? require("../../Assets/backgroundPink.png")
          : require("../../Assets/backgroundGreen.png")
      }
    >
      <View style={{ top: 510 * 0.35, position: "absolute" }}>
        <Text
          style={{
            fontSize: 20,
            color: isSpeechToText
              ? Theme.colors.pink.v1
              : Theme.colors.green.v1,
          }}
        >
          {isSpeechToText
            ? "Clique para gravar o áudio"
            : isSpeechToText && isRecording
            ? "Clique para para a gravação"
            : !isSpeechToText && recordingFileUri
            ? "Clique para reproduzir o áudio"
            : "Digite algo para gerar o áudio"}
        </Text>
        <Button
          isRecording={isRecording}
          {...rest}
          isSpeechToText={isSpeechToText}
          recordingFileUri={recordingFileUri}
        />
      </View>
    </BackgroundImageButton>
  );
};

export default ButtonBoxComponent;
