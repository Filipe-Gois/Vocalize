import { AxiosPromise } from "axios";
import api, { textToSpeech } from "../Utils/service";
import { useMutation } from "@tanstack/react-query";
import { AudioResponse } from "../Types/Types";

const handlePost = async (texto: string): AxiosPromise<AudioResponse> => {
  const response = await api.post<AudioResponse>(
    `${textToSpeech}?texto=${texto}`
  );

  return response;
};

export const useTextMutate = () => {
  const mutate = useMutation({
    mutationFn: handlePost,
  });
  return mutate;
};

//baixar o expo install react-native-sound para tocar o audio sem precisar baixar
