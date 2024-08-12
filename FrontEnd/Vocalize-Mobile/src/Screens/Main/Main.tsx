import {
  Alert,
  StatusBar,
  TextInput,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Switch from "../../Components/Switch/Switch";
import { Theme } from "../../Theme/Theme";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import ButtonBoxComponent from "../../Components/Button/ButtonBox";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormValues } from "../../Types/Types";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAudioMutate } from "../../Hooks/useAudioMute";
import { useTextMutate } from "../../Hooks/useTextMutate";

//validações de inputs
const inputSchema = yup.object({
  Texto: yup.string().required("Informe o texto!"),
  // .min(5, "O texto deve ter no mínimo 5 caracteres!"),
});

const Main = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFileUri, setRecordingFileUri] = useState<string | null>(null);
  const [isSpeechToText, setIsSpeechToText] = useState(true);

  const {
    mutate: audioMutate,
    data: audioData,
    isError: isErrorAudio,
  } = useAudioMutate();

  const {
    mutate: textMutate,
    data: textData,
    isError: isErrorText,
    isSuccess: isSuccessText,
    status: textStatus,
  } = useTextMutate();
  //<FormValues>: referencia o nome de cada elemento
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(inputSchema),
  });

  const handlePostAudio = (audio: File) => {
    const formData = new FormData();
    const data = audio;
    audioMutate(audio);
  };
  const handlePostText = ({ Texto }: FormValues) => {
    console.log("Texto", Texto);
    textMutate(Texto);
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
          "Nao foi possivel iniciar a gravacao do audio."
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

        // const audio = new File();

        // handlePostAudio(audio);
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
    // valida se o usuario minimizar o teclado, disparando o post da api
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        handleSubmit(handlePostText)();
        console.log("minimizou");
      }
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      animation.value = 1.3;
    } else {
      animation.value = 1;
    }
  }, [isRecording]);

  const animation = useSharedValue(1);

  const animationButtonScale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withTiming(animation.value, {
              duration: 1000,
            }),
            -1,
            true
          ),
        },
      ],
    };
  });

  useEffect(() => {
    if (isSuccessText) {
      console.log("Texto enviado com sucesso:", textData);
      // Faça algo com a resposta, como atualizar o estado ou exibir uma mensagem
    }

    if (isErrorText) {
      console.error("Erro ao enviar texto:");
      // Mostre uma mensagem de erro ou execute outra ação apropriada
    }
  }, [isSuccessText, isErrorText, textData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
          translucent
        />
        <View style={styles.innerContainer}>
          <Switch
            setIsSpeechToText={setIsSpeechToText}
            isSpeechToText={isSpeechToText}
            isRecording={isRecording}
          />

          <Controller
            control={control}
            name="Texto"
            render={({ field: { onChange } }) => (
              <TextInput
                onChangeText={onChange}
                textAlignVertical="center"
                multiline
                editable={!isSpeechToText}
                placeholderTextColor={
                  isSpeechToText ? Theme.colors.pink.v1 : Theme.colors.green.v1
                }
                placeholder={
                  isSpeechToText
                    ? "Áudio Convertido:"
                    : "Insira seu Texto aqui:"
                }
                style={[
                  styles.textInput,
                  {
                    borderColor: isSpeechToText
                      ? Theme.colors.pink.v1
                      : Theme.colors.green.v1,
                    color: isSpeechToText
                      ? Theme.colors.pink.v1
                      : Theme.colors.green.v1,
                  },
                ]}
              />
            )}
          />
        </View>
        <ButtonBoxComponent
          style={isRecording && animationButtonScale}
          isRecording={isRecording}
          recordingFileUri={recordingFileUri}
          onPress={isSpeechToText ? gravarOuPararAudio : reproduzirAudio}
          isSpeechToText={isSpeechToText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    alignItems: "center",
  },
  textInput: {
    width: "90%",
    borderWidth: 2,
    borderRadius: 25,
    height: 150,
    padding: 15,
  },
});

export default Main;
