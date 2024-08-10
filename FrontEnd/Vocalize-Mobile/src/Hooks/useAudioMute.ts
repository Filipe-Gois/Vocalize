//fala para texto
import { useMutation } from "@tanstack/react-query";
import { FormValues, TextResponse } from "../Types/Types";
import api, { speechToText } from "../Utils/service";
import { AxiosPromise } from "axios";

const handlePost = async (audio: File): AxiosPromise<TextResponse> => {
  const response = await api.post<TextResponse>(speechToText, audio);

  return response;
};

export const useAudioMutate = () => {
  const mutate = useMutation({
    mutationFn: handlePost,
  });

  return mutate;
};
