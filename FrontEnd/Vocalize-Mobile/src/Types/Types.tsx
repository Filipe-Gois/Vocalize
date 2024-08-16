import { AxiosPromise, AxiosResponse } from "axios";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  isSpeechToText: boolean;
  recordingFileUri: string | null;
  isRecording: boolean;
  textData?: AxiosResponse<AudioResponse>;
};

type AudioData = {
  uri: string;
  name: string;
  type: string;
};

type AudioResponse = {
  bytesAudio: Uint8Array;
};

type TextResponse = {
  texto: string;
};

export { ButtonProps, AudioData, AudioResponse, TextResponse };
