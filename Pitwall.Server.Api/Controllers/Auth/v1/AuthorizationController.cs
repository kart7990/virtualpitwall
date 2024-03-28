using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Authorization.Models;

namespace Pitwall.Server.Api.Controllers.Auth.v1
{
    [ApiVersion(1.0)]
    [ApiController]
    [Route("v{version:apiVersion}/authorization")]
    public class AuthorizationController(IAuthorizationService authorizationService) : ControllerBase
    {
        private readonly IAuthorizationService authorizationService = authorizationService;

        [HttpPost("authorize")]
        [ProducesResponseType(typeof(JsonWebToken), 200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Authorize([FromBody] AuthorizeRequest model)
        {
            var result = await authorizationService.AuthorizeOAuthUser(model);

            if (result.Jwt != null)
            {
                return Ok(result.Jwt);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("authorizetestuser")]
        [ProducesResponseType(typeof(JsonWebToken), 200)]
        public async Task<IActionResult> AuthorizeTestUser()
        {
            var result = await authorizationService.AuthorizeTestUser();
            return Ok(result.Jwt);
        }
    }
}
