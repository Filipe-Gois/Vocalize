using Microsoft.CognitiveServices.Speech;
using Vocalize_Api.Domains;

namespace Vocalize_Api.Interfaces
{
    public interface ISpeakServiceRepository
    {
        public Task<string> FalaParaTexto(AudioInput file);
        public Task<byte[]> TextoParaFala(string texto);
    }
}
