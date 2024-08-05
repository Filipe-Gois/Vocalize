import axios from "axios";

const urlApi = ``;

const api = axios.create({ baseURL: urlApi });

const speechToText = `/`;
const textToSpeech = `/`;

export { speechToText, textToSpeech };
export default api;
