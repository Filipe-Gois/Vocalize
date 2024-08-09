import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
  isSpeechToText: boolean;
  recordingFileUri: string | null;
  isRecording: boolean;
};

type FormValues = {
  Texto: string;
};

export { ButtonProps, FormValues };
