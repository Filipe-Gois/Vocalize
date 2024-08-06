import { Alert, StatusBar, TextInput, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import api, { speechToText, textToSpeech } from "./src/Utils/service";
import { useForm, Controller } from "react-hook-form";
import Switch from "./src/Components/Switch/Switch";
import { Theme } from "./src/Theme/Theme";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import ButtonBoxComponent from "./src/Components/Button/Button";

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFileUri, setRecordingFileUri] = useState<string | null>(null);
  const [isSpeechToText, setIsSpeechToText] = useState(true);

  // const buttonRef = useRef<React.RefObject<TouchableOpacity> | null>(null);

  type FormValues = {
    texto: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>();

  const handlePost = async (data: FormValues) => {
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
    setIsRecording(false);
    setRecording(null);
  };

  const gravarAudio = async () => {
    const { granted } = await Audio.getPermissionsAsync();

    if (granted) {
      try {
        // buttonRef.current?.current?.props.onPress()
        setIsRecording(true);
        const { recording } = await Audio.Recording.createAsync();
        setRecording(recording);
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Erro ao gravar!",
          `Nao foi possivel iniciar a gravacao do audio.`
        );
      }
    }
  };

  const pararGravacaoDeAudio = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI();

        console.log(fileUri);
        setRecordingFileUri(fileUri);
        limparCampos();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao pausar!", "Nao foi possivel pausar a gravacao.");
    }
  };

  const gravarOuPararAudio = () => {
    if (!isRecording) {
      gravarAudio();
    } else {
      pararGravacaoDeAudio();
    }
  };

  const reproduzirAudio = async () => {
    if (recordingFileUri) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingFileUri },
        { shouldPlay: true }
      );

      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  };

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (granted) {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(`Está gravando ? R: ${isRecording ? "Sim" : "Não"}`);
  }, [isRecording]);

  return (
    <SafeAreaView>
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
        <ButtonBoxComponent
          isRecording={isRecording}
          recordingFileUri={recordingFileUri}
          onPress={isSpeechToText ? gravarOuPararAudio : reproduzirAudio}
          isSpeechToText={isSpeechToText}
        />
      </View>
    </SafeAreaView>
  );
}
