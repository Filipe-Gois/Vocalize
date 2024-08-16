using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;
using System.Diagnostics;
using Vocalize_Api.Domains;
using Vocalize_Api.Interfaces;
using Vocalize_Api.Utils;

namespace Vocalize_Api.Repositories
{
    public class SpeakServiceRepository : ISpeakServiceRepository
    {
        private readonly string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY")!;
        private readonly string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION")!;
        private readonly string speechUri = Environment.GetEnvironmentVariable("SPEECH_URI")!;
        private readonly string idioma = "pt-BR";

        public async Task<string> FalaParaTexto(AudioInput file)
        {

            if (file.File == null || file.File.Length == 0)
            {
                throw new Exception("Informe um arquivo de áudio!");
            }

            string caminhoDoArquivo = await GlobalFunctions.SalvarArquivoNoRoot(file);

            SpeechConfig speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
            speechConfig.SpeechRecognitionLanguage = idioma;

            AudioConfig audioConfig = AudioConfig.FromWavFileInput(caminhoDoArquivo);
            using SpeechRecognizer speechRecognizer = new(speechConfig, idioma, audioConfig);

            SpeechRecognitionResult result = await speechRecognizer.RecognizeOnceAsync();

            string resultadoValidado = GlobalFunctions.ValidarRespostaDoAudio(result);

            Debug.WriteLine($"Resultado da fala: {audioConfig}");


            return resultadoValidado;

        }

        // Método auxiliar para lidar com detalhes do cancelamento

        //public async Task<string> FalaParaTexto(AudioInput file)
        //{

        //    try
        //    {
        //        if (file.File == null || file.File.Length == 0)
        //        {
        //            throw new Exception("Informe um arquivo de áudio!");
        //        }

        //        PushAudioInputStream pushStream = new();

        //        //Copia os dados do arquivo para o PushAudioInputStream
        //        using (MemoryStream memoryStream = new())
        //        {
        //            await file.File.CopyToAsync(memoryStream);
        //            memoryStream.Position = 0; // Redefine a posição para o início

        //            // Escreva os bytes no PushAudioInputStream

        //            using BinaryReader audioStream = new(memoryStream);
        //            byte[] buffer = new byte[16384];
        //            int bytesRead = 0;
        //            while ((bytesRead = audioStream.Read(buffer, 0, buffer.Length)) > 0)
        //            {
        //                pushStream.Write(buffer, bytesRead);
        //            }

        //        }

        //        pushStream.Close();

        //        SpeechConfig speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
        //        speechConfig.SpeechRecognitionLanguage = idioma;


        //        //AudioConfig audioConfig = AudioConfig.FromWavFileInput("teste1.wav");
        //        AudioConfig audioConfig = AudioConfig.FromStreamInput(pushStream);
        //        using SpeechRecognizer speechRecognizer = new(speechConfig, idioma, audioConfig);

        //        SpeechRecognitionResult result = await speechRecognizer.RecognizeOnceAsync();



        //        string resultadoValidado = GlobalFunctions.ValidarRespostaDoAudio(result);

        //        // Adicione logs para verificar o resultado
        //        Debug.WriteLine($"Resultado da fala: {audioConfig}");


        //        return resultadoValidado;
        //    }
        //    catch (Exception)
        //    {

        //        throw;
        //    }


        //}


        //public async Task<string> FalaParaTexto(AudioInput file)
        //{
        //    try
        //    {
        //        if (file.File == null || file.File.Length == 0)
        //        {
        //            throw new Exception("Informe um arquivo de áudio!");
        //        }

        //        SpeechConfig speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
        //        speechConfig.SpeechRecognitionLanguage = idioma;

        //        using var reader = new BinaryReader(file.File.OpenReadStream());
        //        using var audioConfigStream = AudioInputStream.CreatePushStream();
        //        using var audioConfig = AudioConfig.FromStreamInput(audioConfigStream);
        //        using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

        //        byte[] readBytes;
        //        do
        //        {
        //            readBytes = reader.ReadBytes(16384);
        //            audioConfigStream.Write(readBytes, readBytes.Length);
        //        } while (readBytes.Length > 0);

        //        var result = await speechRecognizer.RecognizeOnceAsync();
        //        Debug.WriteLine($"RECOGNIZED: Text={result.Text}");

        //        string resultadoValidado = GlobalFunctions.ValidarRespostaDoAudio(result);

        //        return resultadoValidado;
        //    }
        //    catch (Exception ex)
        //    {
        //        Debug.WriteLine($"Erro ao processar o arquivo de áudio: {ex.Message}");
        //        throw;
        //    }
        //}


        public async Task<byte[]> TextoParaFala(string texto)
        {

            SpeechConfig config = SpeechConfig.FromSubscription(speechKey, speechRegion);

            config.SpeechRecognitionLanguage = idioma;

            //o argumento "null" faz com que o audio nao seja reproduzido ao término da requisição
            using SpeechSynthesizer synthesizer = new(config, null);

            SpeechSynthesisResult resultado = await synthesizer.SpeakTextAsync(texto);

            if (resultado.Reason == ResultReason.SynthesizingAudioCompleted)
            {
                // Retorna o áudio gerado como um byte[]
                return resultado.AudioData;
            }
            else
            {
                throw new Exception($"Erro na síntese de fala: {resultado.Reason}");
            }
        }
    }
}
