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
        public async Task<IActionResult> FalaParaTexto(string audioUri)
        {
            try
            {

                string texto = await _speakServiceRepository.FalaParaTexto(audioUri);

                return StatusCode(201, texto);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


        [HttpPost("TextoParaFala")]
        public async Task<IActionResult> TextoParaFala()
        {
            try
            {
                string texto = _speakServiceRepository.TextoParaFala();

                return StatusCode(201, texto);
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }
    }
}
