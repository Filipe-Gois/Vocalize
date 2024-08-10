using Microsoft.CognitiveServices.Speech;

namespace Vocalize_Api.Interfaces
{
    public interface ISpeakServiceRepository
    {
        public Task<string> FalaParaTexto(IFormFile ArquivoDeAudio);
        public Task<byte[]> TextoParaFala(string texto);
    }
}
