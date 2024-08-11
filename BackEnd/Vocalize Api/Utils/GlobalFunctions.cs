using Microsoft.CognitiveServices.Speech;

namespace Vocalize_Api.Utils
{
    public static class GlobalFunctions
    {
        public static IFormFile ConvertToWav(IFormFile file)
        {
            return file;

        }
        public static string ValidarRespostaDoAudio(SpeechRecognitionResult result)
        {
            switch (result.Reason)
            {
                case ResultReason.RecognizedSpeech:
                    return result.Text;
                case ResultReason.NoMatch:
                    // Adicione informações adicionais, se disponíveis
                    NoMatchDetails noMatch = NoMatchDetails.FromResult(result);
                    var message = $"Nenhuma fala reconhecida. Duração do áudio: {result.Duration}. Detalhes: {noMatch.Reason} ";
                    throw new Exception(message);
                case ResultReason.Canceled:
                    CancellationDetails cancellation = CancellationDetails.FromResult(result);
                    throw new Exception($"Reconhecimento cancelado: {cancellation.Reason}, Detalhes: {cancellation.ErrorDetails}");
                default:
                    throw new Exception($"Erro no reconhecimento: {result.Reason}");
            }
        }

    }

}
