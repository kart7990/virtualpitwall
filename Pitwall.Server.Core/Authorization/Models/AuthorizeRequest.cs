using System.ComponentModel.DataAnnotations;

namespace Pitwall.Server.Core.Authorization.Models
{
    public class AuthorizeRequest
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        public string Token { get; set; }
    }
}
