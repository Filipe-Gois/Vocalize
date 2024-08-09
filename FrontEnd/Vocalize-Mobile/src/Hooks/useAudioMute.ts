//fala para texto
import { useMutation } from "@tanstack/react-query";
import { FormValues } from "../Types/Types";
import api, { speechToText } from "../Utils/service";
import { AxiosPromise } from "axios";

const handlePost = async (dados: File): AxiosPromise<string> => {
  const formData = new FormData();

  const { data, status } = await api.post(speechToText);

  return data;
};

export const useAudioMutate = () => {
  const mutate = useMutation({
    mutationFn: handlePost,
  });

  return mutate;
};
