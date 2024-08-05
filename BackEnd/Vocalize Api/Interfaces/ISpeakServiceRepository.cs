namespace Vocalize_Api.Interfaces
{
    public interface ISpeakServiceRepository
    {
        public Task<string> FalaParaTexto(IFormFile ArquivoDeAudio);
        public Task<string> TextoParaFala(string texto);
    }
}
