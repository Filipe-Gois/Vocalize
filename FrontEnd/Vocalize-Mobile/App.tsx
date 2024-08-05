import { StatusBar, TextInput } from "react-native";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import api, { speechToText, textToSpeech } from "./src/Utils/service";
import { useForm } from "react-hook-form";
import Switch from "./src/Components/Switch/Switch";
import { Theme } from "./src/Theme/Theme";
import Button from "./src/Components/Button/Button";

export default function App() {
  const [recording, setRecording] = useState<boolean | null>(null);
  const [uriRecording, setUriRecording] = useState<string | null>(null);
  const [isSpeechToText, setIsSpeechToText] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePost = async () => {
    try {
      const formData = new FormData();

      if (isSpeechToText) {
        await api.post(`${speechToText}`);
      } else {
        await api.post(`${textToSpeech}`);
      }
    } catch (error) {}
  };

  const limparCampos = () => {
    setRecording(null);
    setUriRecording(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <StatusBar
          backgroundColor={"transparent"}
          barStyle="dark-content"
          translucent
        />
        <View style={{ alignItems: "center" }}>
          <Switch
            setIsSpeechToText={setIsSpeechToText}
            isSpeechToText={isSpeechToText}
          />

          <TextInput
            textAlignVertical="center"
            multiline
            editable={!isSpeechToText}
            placeholderTextColor={
              isSpeechToText ? Theme.colors.pink.v1 : Theme.colors.green.v1
            }
            placeholder={
              isSpeechToText ? "Áudio Convertido:" : "Insira seu Texto aqui:"
            }
            style={{
              width: "90%",
              borderWidth: 2,
              borderRadius: 25,
              borderColor: isSpeechToText
                ? Theme.colors.pink.v1
                : Theme.colors.green.v1,
              height: 150,
              padding: 15,
              color: isSpeechToText
                ? Theme.colors.pink.v1
                : Theme.colors.green.v1,
            }}
          />
        </View>
        <Button isSpeechToText={isSpeechToText} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
