using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vocalize_Api.Interfaces;

namespace Vocalize_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpeakServiceController(ISpeakServiceRepository speakServiceRepository) : ControllerBase
    {
        private readonly ISpeakServiceRepository _speakServiceRepository = speakServiceRepository;


        [HttpPost("FalaParaTexto")]
        public async Task<IActionResult> FalaParaTexto([FromForm] IFormFile ArquivoDeAudio)
        {
            try
            {

                string texto = await _speakServiceRepository.FalaParaTexto(ArquivoDeAudio);

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
                string teste = await _speakServiceRepository.TextoParaFala(texto);

                return StatusCode(201, teste);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
