namespace Vocalize_Api.Interfaces
{
    public interface ISpeakServiceRepository
    {
        public Task<string> FalaParaTexto(string audioUri);
        public string TextoParaFala();
    }
}
