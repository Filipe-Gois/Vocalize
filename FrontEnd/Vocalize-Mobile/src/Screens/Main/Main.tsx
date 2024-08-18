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
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAudioMutate } from "../../Hooks/useAudioMute";
import { useTextMutate } from "../../Hooks/useTextMutate";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as FileSystem from "expo-file-system";

type FormValues = z.infer<typeof inputSchema>;

//validações de inputs. Apenas definir o tipo já indica que o campo é obrigatório.
const inputSchema = z.object({
  Texto: z.string().min(1), //indica que deve ter no minimo 1 caracter
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
    resolver: zodResolver(inputSchema),
  });

  const handlePostText = ({ Texto }: FormValues) => {
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
        setIsRecording(true);
        const { recording } = await Audio.Recording.createAsync();
        setRecording(recording);
      } catch (error) {
        Alert.alert(
          "Erro ao gravar!",
          "Nao foi possivel iniciar a gravacao do audio."
        );
      }
    }
  };

  // Função para criar um Blob a partir da URI
  const createBlobFromUri = async (uri: string): Promise<Blob> => {
    const response = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return new Blob([response], { type: `audio/${uri.split(".").pop()}` });
  };

  const handlePostAudio = async (uri: string) => {
    const formData = new FormData();

    const blob = await createBlobFromUri(uri);
    console.log(uri);
    // formData.append("File", blob, `audio.${uri.split(".").pop()}`);
    //FOI ASSIM, MAS ESTÁ DANDO ERRO AO PASSAR DE .3GP PARA .WAV
    formData.append(
      "File",
      JSON.parse(
        JSON.stringify({
          name: `audio.${uri.split(".").pop()}`,
          type: `audio/${uri.split(".").pop()}`,
          uri: uri,
        })
      )
    );

    // formData.append("File", uri);
    audioMutate(formData);
  };

  const pararGravacaoDeAudio = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI()!; //colocar o "!" funciona em typescript também, não só no c#

        await handlePostAudio(fileUri);

        setRecordingFileUri(fileUri);
        limparCampos();
      }
    } catch (error) {
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

  // Função para criar um blob a partir de bytes
  const createBlobFromBytes = (bytes: Uint8Array) => {
    if (bytes) {
      return new Blob([bytes], { type: "audio/wav" }); // ajuste o tipo MIME conforme necessário
    }
  };

  const reproduzirAudio = async () => {
    console.log("textData?.data.bytesAudio", textData?.data.bytesAudio);
    if (textData?.data.bytesAudio) {
      try {
        const blob = createBlobFromBytes(textData?.data.bytesAudio);

        console.log(blob);

        const url = blob ? URL.createObjectURL(blob) : null;

        if (url) {
          const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true }
          );

          await sound.setPositionAsync(0);
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Erro ao reproduzir áudio:", error);
      }
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

  useEffect(() => {
    if (isSuccessText) {
      // Faça algo com a resposta, como atualizar o estado ou exibir uma mensagem
    }

    if (isErrorText) {
      console.error("Erro ao enviar texto:");
      // Mostre uma mensagem de erro ou execute outra ação apropriada
    }
  }, [isSuccessText, isErrorText, textData]);

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

  // useEffect(() => {
  //   console.log("textData:", textData?.data.bytesAudio);
  // }, [textData]);
  useEffect(() => {
    console.log("audioData:", audioData?.data.texto);
  }, [audioData]);

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
          textData={textData}
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
