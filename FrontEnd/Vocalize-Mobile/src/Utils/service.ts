import axios from "axios";

const ip = `192.168.15.61`;
const ipSenai = `172.16.39.113`;
const apiPort = `7105`;

const urlApi = `https://${ipSenai}:${apiPort}/api/SpeakService`;

const api = axios.create({ baseURL: urlApi });

const speechToText = `/FalaParaTexto`;
const textToSpeech = `/TextoParaFala`;

export { speechToText, textToSpeech };
export default api;
