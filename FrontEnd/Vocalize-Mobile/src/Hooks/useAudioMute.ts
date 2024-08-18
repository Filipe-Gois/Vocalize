//fala para texto
import { useMutation } from "@tanstack/react-query";
import { TextResponse } from "../Types/Types";
import api, { speechToText } from "../Utils/service";
import axios, { AxiosPromise } from "axios";

//: AxiosPromise<TextResponse>
const handlePost = async (audioFormData: FormData) => {
  console.log("teste", audioFormData.getAll("File"));
  try {
    const response = await api.postForm<TextResponse>(
      speechToText,
      audioFormData
    );

    console.log(response.status);
    return response;

    // const response = await axios.get(
    //   "http://192.168.15.61:5193/api/SpeakService"
    // );
    // console.log(response.data);
    // return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro na requisição:", error.message);
      console.error("Status do erro:", error.response?.status);
      console.error("Dados do erro:", error.response?.data);
    }
    console.log(error);
  }
};

export const useAudioMutate = () => {
  const mutate = useMutation({
    mutationFn: handlePost,
  });

  return mutate;
};
