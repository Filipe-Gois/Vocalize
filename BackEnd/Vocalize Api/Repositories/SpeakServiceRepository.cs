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

        public async Task<string> FalaParaTexto(string audioUri)
        {
            if (string.IsNullOrEmpty(audioUri))
            {
                throw new Exception("Nenhum arquivo inserido.");
            }

            try
            {

                // Crie um PushAudioInputStream e um AudioConfig a partir dele.
                var pushStream = new PushAudioInputStream();
                using (var audioConfig = AudioConfig.FromStreamInput(pushStream))
                {
                    // Leia o conteúdo do MemoryStream e escreva no PushAudioInputStream.
                    await WriteStreamToPushAudioInputStreamAsync(audioStream, pushStream);

                    // Configure o SpeechConfig e crie um SpeechRecognizer.
                    var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
                    speechConfig.SpeechRecognitionLanguage = "en-US"; // Defina o idioma de reconhecimento.

                    using var recognizer = new SpeechRecognizer(speechConfig, audioConfig);

                    // Execute o reconhecimento de fala.
                    var result = await recognizer.RecognizeOnceAsync();

                    // Verifique o resultado do reconhecimento.
                    return result.Reason switch
                    {
                        ResultReason.RecognizedSpeech => result.Text,
                        ResultReason.NoMatch => "No speech could be recognized.",
                        ResultReason.Canceled => HandleCancellation(result),
                        _ => "An unknown error occurred."
                    };
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public string TextoParaFala()
        {
            throw new NotImplementedException();
        }

        private string HandleCancellation(SpeechRecognitionResult result)
        {
            var cancellation = CancellationDetails.FromResult(result);
            string errorMessage = $"A tradução foi cancelada. Motivo: {cancellation.Reason}";

            if (cancellation.Reason == CancellationReason.Error)
            {
                errorMessage += $" Código de erro: {cancellation.ErrorCode}. Detalhes: {cancellation.ErrorDetails}";
            }

            return errorMessage;
        }


        private string OutputSpeechRecognitionResult(SpeechRecognitionResult result)
        {
            return result.Reason switch
            {
                ResultReason.RecognizedSpeech => result.Text,
                ResultReason.NoMatch => "NOMATCH: Speech could not be recognized.",
                ResultReason.Canceled => HandleCancellation(result),
                _ => "Ocorreu um erro desconhecido."
            };
        }
    }
}
}