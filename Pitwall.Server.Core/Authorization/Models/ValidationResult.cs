using Newtonsoft.Json;

namespace Pitwall.Server.Core.Authorization.Models
{
    internal class ValidationResult
    {
        [JsonProperty("email")]
        public string Email { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
