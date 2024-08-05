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
                SpeechConfig speechConfig = SpeechConfig.FromEndpoint(new Uri(speechUri), speechKey);
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

        public async Task<string> TextoParaFala(string texto)
        {
            throw new NotImplementedException();
        }





    }
}
