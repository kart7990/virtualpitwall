using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Authorization.Models;
using System.ComponentModel.DataAnnotations;

namespace Pitwall.Server.Api.Controllers.Auth
{
    [ApiVersion(1.0)]
    [ApiController]
    [Route("authorization")]
    public class AuthorizationController(ILogger<AuthorizationController> logger, IAuthorizationService authorizationService) : ControllerBase
    {
        private readonly ILogger<AuthorizationController> logger = logger;
        private readonly IAuthorizationService authorizationService = authorizationService;

        [HttpPost("authorize")]
        [ProducesResponseType(typeof(JsonWebToken), 200)]
        public IActionResult Authorize([FromBody] AuthorizeRequest model)
        {
            //TODO: David H - Implement staging/prod authorization calling out to auth server


            ////using var client = new HttpClient();
            //var responseMessage = await client.PostAsJsonAsync("https://localhost:7216/authorization/authorize", model);

            //if (responseMessage != null)
            //{
            //    var jwt = JsonConvert.DeserializeObject<JsonWebToken>(await responseMessage.Content.ReadAsStringAsync());

            //    //Check db and add user if needed

            //    return Ok(jwt);
            //}
            //else
            //{
            //    return BadRequest();
            //}
            return BadRequest();
        }

#if DEBUG
        [HttpPost("authorizelocal")]
        [ProducesResponseType(typeof(JsonWebToken), 200)]
        public async Task<IActionResult> AuthorizeLocal()
        {
            logger.LogInformation("Authorizing Local Test User");
            var jwt = await authorizationService.AuthorizeLocalUser(
                new AuthorizedTestUser(Guid.Parse("50197554-dff9-4a43-a265-8ce8d411fb0f"), "test@virtualpitbox.com", "John Doe"));
            return Ok(jwt);
        }
    }
#endif

    public class AuthorizeRequest
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        public string Token { get; set; }
    }
}
