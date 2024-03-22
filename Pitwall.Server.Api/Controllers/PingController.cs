using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Pitwall.Server.Api.Controllers.Auth;
using Pitwall.Server.Core.Authorization;

namespace Pitwall.Server.Api.Controllers
{
    [Produces("application/json")]
    [ApiVersion(1.0)]
    [ApiController]
    [Route("ping")]
    public class PingController(IAuthorizedPitwallUser user) : AuthorizedController
    {
        [HttpGet]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult Get()
        {
            if (user != null)
            {
                return Ok("Hello " + user.Email);
            }
            else
            {
                return Ok("Hello Unauthorized User");
            }
        }
    }
}