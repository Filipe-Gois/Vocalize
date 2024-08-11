using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vocalize_Api.Domains
{
    public class AudioInput
    {
        [JsonIgnore]
        public IFormFile? File { get; set; }
    }
}
