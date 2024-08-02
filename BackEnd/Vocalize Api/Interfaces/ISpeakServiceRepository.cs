namespace Vocalize_Api.Interfaces
{
    public interface ISpeakServiceRepository
    {
        public Task<string> FalaParaTexto(Stream audioStream, bool isFile);
        public string TextoParaFala();
    }
}
