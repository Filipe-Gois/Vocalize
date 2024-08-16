using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.CognitiveServices.Speech;
using NAudio.Wave;
using System.IO;
using Vocalize_Api.Domains;

namespace Vocalize_Api.Utils
{
    public static class GlobalFunctions
    {

        public static async Task<string> SalvarArquivoNoRoot(AudioInput file)
        {
            string diretorioRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "AudioFiles");

            if (!Directory.Exists(diretorioRoot))
            {
                Directory.CreateDirectory(diretorioRoot);
            }

            ExcluirArquivosRoot(diretorioRoot);

            string nomeDoArquivo = $"{Path.GetFileNameWithoutExtension(file.File!.FileName)}{Guid.NewGuid()}{Path.GetExtension(file.File!.FileName)}";

            string caminhoDoArquivo = Path.Combine(diretorioRoot, nomeDoArquivo);

            using (FileStream fileStream = new(caminhoDoArquivo, FileMode.Create))
            {
                await file.File.CopyToAsync(fileStream);
            }

            //valida se o arquivo está no formato wav
            if (Path.GetExtension(file.File!.FileName) != ".wav")
            {

                string caminhoDoArquivoConvertido = ConverterArquivoParaFormatoWav(caminhoDoArquivo, diretorioRoot);
                //exclui o arquivo em formato diferente de .wav
                File.Delete(caminhoDoArquivo);
                return caminhoDoArquivoConvertido;

            }
            return caminhoDoArquivo;
        }

        public static string ConverterArquivoParaFormatoWav(string inputFilePath, string outputDirectory)
        {
            try
            {
                if (!Directory.Exists(outputDirectory))
                {
                    Directory.CreateDirectory(outputDirectory);
                }

                string outputFilePath = Path.Combine(outputDirectory, Path.GetFileNameWithoutExtension(inputFilePath) + ".wav");

                // Converte o arquivo de áudio para .wav e salva no diretório de saída
                using (var reader = new AudioFileReader(inputFilePath))
                {
                    WaveFileWriter.CreateWaveFile(outputFilePath, reader);
                }

                // Retorna o caminho do arquivo convertido
                return outputFilePath;
            }
            catch (Exception)
            {

                throw new Exception("Erro ao converter arquivo para .wav!");
            }
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

        public static bool PastaEstaVazia(string caminho)
        {
            if (!Directory.Exists(caminho))
            {
                throw new DirectoryNotFoundException($"O diretório especificado não existe: {caminho}");
            }

            return Directory.GetFiles(caminho).Length == 0 && Directory.GetDirectories(caminho).Length == 0;
        }

        public static void ExcluirArquivosRoot(string caminho)
        {
            // Verifica se a pasta existe
            if (!Directory.Exists(caminho))
            {
                throw new DirectoryNotFoundException($"O diretório especificado não existe: {caminho}");
            }

            string[] arquivos = Directory.GetFiles(caminho);


            foreach (string arquivo in arquivos)
            {
                try
                {
                    File.Delete(arquivo);
                }
                catch (Exception e)
                {

                    throw new DirectoryNotFoundException($"Não foi possível excluir o arquivo {arquivo}.");
                }

            }

        }
    }

}
