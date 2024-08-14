import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Theme } from "../../Theme/Theme";
import Button from "../ButtonBox/Button";
import { ButtonProps } from "../../Types/Types";

const ButtonBoxComponent = ({
  isSpeechToText,
  recordingFileUri,
  isRecording,
  style: styleAnimatedView,
  textData,
  ...rest
}: ButtonProps) => {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={
        isSpeechToText
          ? require("../../Assets/backgroundPink.png")
          : require("../../Assets/backgroundGreen.png")
      }
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            {
              color: isSpeechToText
                ? Theme.colors.pink.v1
                : Theme.colors.green.v1,
            },
          ]}
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
          textData={textData}
          style={styleAnimatedView}
          isRecording={isRecording}
          {...rest}
          isSpeechToText={isSpeechToText}
          recordingFileUri={recordingFileUri}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 555,
    position: "relative",
    bottom: 0,
    alignItems: "center",
  },
  textContainer: {
    top: 510 * 0.35,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});

export default ButtonBoxComponent;
