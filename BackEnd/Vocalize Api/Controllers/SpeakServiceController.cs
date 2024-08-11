using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CognitiveServices.Speech;
using Vocalize_Api.Domains;
using Vocalize_Api.Interfaces;

namespace Vocalize_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeakServiceController(ISpeakServiceRepository speakServiceRepository) : ControllerBase
    {
        private readonly ISpeakServiceRepository _speakServiceRepository = speakServiceRepository;


        [HttpPost("FalaParaTexto")]
        public async Task<IActionResult> FalaParaTexto([FromForm] AudioInput file)
        {
            try
            {

                string texto = await _speakServiceRepository.FalaParaTexto(file);

                return StatusCode(201, texto);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpPost("TextoParaFala")]
        public async Task<IActionResult> TextoParaFala(string texto)
        {
            try
            {
                byte[] audio = await _speakServiceRepository.TextoParaFala(texto);

                return StatusCode(201, File(audio, "audio/wav"));
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
