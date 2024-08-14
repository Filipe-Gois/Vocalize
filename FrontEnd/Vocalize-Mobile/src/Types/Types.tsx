import { AxiosPromise, AxiosResponse } from "axios";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  isSpeechToText: boolean;
  recordingFileUri: string | null;
  isRecording: boolean;
  textData?: AxiosResponse<AudioResponse>;
};

type FormValues = {
  Texto: string;
};

type AudioResponse = {
  fileContents: string;
  contentType: "audio/wav";
  fileDownloadName: "";
  lastModified: null;
  entityTag: null;
  enableRangeProcessing: false;
};

type TextResponse = {};

export { ButtonProps, FormValues, AudioResponse, TextResponse };
