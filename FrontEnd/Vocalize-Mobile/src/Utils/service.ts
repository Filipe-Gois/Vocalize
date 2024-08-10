import axios from "axios";

const ip = `192.168.15.61`;
const apiPort = `7105`;

const urlApi = `https://${ip}:${apiPort}/api/SpeakService`;

const api = axios.create({ baseURL: urlApi });

const speechToText = `/FalaParaTexto`;
const textToSpeech = `/TextoParaFala`;

export { speechToText, textToSpeech };
export default api;
