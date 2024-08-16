import { AxiosPromise, AxiosResponse } from "axios";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  isSpeechToText: boolean;
  recordingFileUri: string | null;
  isRecording: boolean;
  textData?: AxiosResponse<AudioResponse>;
};

type AudioResponse = {
  bytesAudio: Uint8Array;
};

type TextResponse = {};

export { ButtonProps, AudioResponse, TextResponse };
