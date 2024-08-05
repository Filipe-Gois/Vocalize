import { StatusBar, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Theme } from "../../Theme/Theme";

type SwitchProps = {
  isSpeechToText: boolean;
  setIsSpeechToText: (value: boolean) => void;
};

const Switch = ({ isSpeechToText = true, setIsSpeechToText }: SwitchProps) => {
  const heightStatusBar = StatusBar.currentHeight;
  const animation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animation.value }],
    };
  });

  return (
    <View
      style={{
        width: 200,
        marginTop: heightStatusBar ? heightStatusBar + 20 : 0,
        marginBottom: heightStatusBar ? heightStatusBar + 20 : 0,
        alignSelf: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (animation.value == 0) {
            animation.value = withTiming(96, { duration: 500 });
            setIsSpeechToText(false);
          } else {
            animation.value = withTiming(0, { duration: 500 });
            setIsSpeechToText(true);
          }
        }}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 30,
          //   backgroundColor: "red",
          borderWidth: 2,
          borderColor: isSpeechToText
            ? Theme.colors.pink.v1
            : Theme.colors.green.v1,
        }}
      >
        <Animated.View
          style={[
            {
              width: 100,
              height: "100%",
              borderRadius: 30,
              backgroundColor: isSpeechToText
                ? Theme.colors.pink.v1
                : Theme.colors.green.v1,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: "row",
            },
            animatedStyle,
          ]}
        >
          {isSpeechToText ? (
            <Feather name="mic" size={30} color="white" />
          ) : (
            <AntDesign name="sound" size={30} color="white" />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default Switch;
