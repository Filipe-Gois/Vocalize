using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.Translation;
using Vocalize_Api.Interfaces;

namespace Vocalize_Api.Repositories
{
    public class SpeakServiceRepository : ISpeakServiceRepository
    {
        private readonly string speechKey = Environment.GetEnvironmentVariable("SPEECH_KEY")!;
        private readonly string speechRegion = Environment.GetEnvironmentVariable("SPEECH_REGION")!;
        private readonly string idioma = "pt-BR";

        // Método auxiliar para lidar com detalhes do cancelamento
        private static string HandleCancellation(TranslationRecognitionResult result)
        {
            CancellationDetails cancellation = CancellationDetails.FromResult(result);
            string errorMessage = $"A tradução foi cancelada. Motivo: {cancellation.Reason}";

            if (cancellation.Reason == CancellationReason.Error)
            {
                errorMessage += $" Código de erro: {cancellation.ErrorCode}. Detalhes: {cancellation.ErrorDetails}";
            }

            throw new Exception(errorMessage);
        }

        public async Task<string> FalaParaTexto(Stream audioStream, bool isFile)
        {
            SpeechTranslationConfig speechTranslationConfig = SpeechTranslationConfig.FromSubscription(speechKey, speechRegion);
            speechTranslationConfig.SpeechRecognitionLanguage = idioma;
            speechTranslationConfig.AddTargetLanguage(idioma);


            // Cria o PushAudioInputStream
            PushAudioInputStream pushStream = AudioInputStream.CreatePushStream();

            // Cria um buffer e lê os dados do Stream
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = await audioStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
            {
                pushStream.Write(buffer, bytesRead);
            }
            pushStream.Close();


            // Se o áudio for de arquivo, cria uma configuração de áudio a partir do fluxo de entrada de áudio
            using AudioConfig audioConfig = isFile
                ? AudioConfig.FromStreamInput(audioStream)
                : AudioConfig.FromDefaultMicrophoneInput(); // Se for gravação em tempo real

            using TranslationRecognizer translationRecognizer = new(speechTranslationConfig, audioConfig);

            TranslationRecognitionResult translationRecognitionResult = await translationRecognizer.RecognizeOnceAsync();

            return translationRecognitionResult.Reason switch
            {
                ResultReason.TranslatedSpeech => translationRecognitionResult.Text,
                ResultReason.NoMatch => throw new Exception("A fala não pôde ser reconhecida. Verifique o áudio e tente novamente."),
                ResultReason.Canceled => HandleCancellation(translationRecognitionResult),
                _ => throw new Exception("Ocorreu um erro desconhecido durante a tradução da fala.")
            };
        }

        public string TextoParaFala()
        {
            throw new NotImplementedException();
        }
    }
}
