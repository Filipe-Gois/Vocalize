import { useQuery } from "@tanstack/react-query";
import api from "../Utils/service";

const handlePostText = async (): Promise<FormData> => {
  const { data, status } = await api.post(`/`);

  return data;
};
const handlePostAudio = async (): Promise<string> => {
  const { data, status } = await api.post(`/`);

  return data;
};

export const useAudioData = () => {
  const query = useQuery({
    queryFn: handlePostText,
    queryKey: ["audio-data"],
  });

  return query;
};
