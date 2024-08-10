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
        private readonly string speechUri = Environment.GetEnvironmentVariable("SPEECH_URI")!;
        private readonly string idioma = "pt-BR";

        // Método auxiliar para lidar com detalhes do cancelamento

        public async Task<string> FalaParaTexto(IFormFile ArquivoDeAudio)
        {



            try
            {
                SpeechConfig speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
                speechConfig.SpeechRecognitionLanguage = idioma;

                using AudioConfig audioConfig = AudioConfig.FromDefaultMicrophoneInput();

                using SpeechRecognizer recognizer = new(speechConfig, audioConfig);

                SpeechRecognitionResult result = await recognizer.RecognizeOnceAsync();


                return result.Text;

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<byte[]> TextoParaFala(string texto)
        {
            SpeechConfig config = SpeechConfig.FromSubscription(speechKey, speechRegion);

            config.SpeechRecognitionLanguage = idioma;

            using SpeechSynthesizer synthesizer = new(config);

            SpeechSynthesisResult resultado = await synthesizer.SpeakTextAsync(texto);

            // Verifica se a síntese foi bem-sucedida
            if (resultado.Reason == ResultReason.SynthesizingAudioCompleted)
            {
                // Retorna o áudio gerado como um byte[]
                return resultado.AudioData;
            }
            else
            {
                // Lida com o erro de síntese
                throw new Exception($"Erro na síntese de fala: {resultado.Reason}");
            }
        }
    }
}
