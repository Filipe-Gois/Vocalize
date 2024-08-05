import { Pressable, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Theme } from "../../Theme/Theme";
import { useEffect } from "react";
import { BackgroundImageButton, ButtonBox } from "./style";
// import BackgroundGreen from "../../Assets/backgroundGreen.png";
// import BackgroundPink from "../../Assets/backgroundPink.png";

type ButtonProps = {
  isSpeechToText: boolean;
};

const Button = ({ isSpeechToText }: ButtonProps) => {
  useEffect(() => {}, []);
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
            ? "Segure para gravar o áudio"
            : "Pressione para reproduzir o áudio"}
        </Text>
        <Pressable
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
        >
          {isSpeechToText ? (
            <Feather name="mic" size={30} color="white" />
          ) : (
            <AntDesign name="sound" size={30} color="white" />
          )}
        </Pressable>
      </View>
    </BackgroundImageButton>
  );
};

export default Button;
