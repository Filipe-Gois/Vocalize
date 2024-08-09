import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Theme } from "../../Theme/Theme";
import { StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ButtonProps } from "../../Types/Types";

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

  const backgroundColor = isSpeechToText
    ? Theme.colors.pink.v1
    : Theme.colors.green.v1;

  const icon = isSpeechToText ? (
    <Feather name="mic" size={30} color="white" />
  ) : (
    <AntDesign name="sound" size={30} color="white" />
  );

  if (isSpeechToText || recordingFileUri) {
    return (
      <TouchableOpacity style={[styles.button, { backgroundColor }]} {...rest}>
        <Animated.View style={animationStyle}>{icon}</Animated.View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 50,
    marginTop: 35,
  },
});

export default Button;
