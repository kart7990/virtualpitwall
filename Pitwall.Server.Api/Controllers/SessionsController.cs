using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Pitwall.Core.Models;
using Pitwall.Server.Api.Controllers.Auth;
using Pitwall.Server.Core.Session;

namespace Pitwall.Server.Api.Controllers
{

    [Produces("application/json")]
    [ApiVersion(1.0)]
    [ApiController]
    [Route("pitwall/session")]
    public class SessionsController(SessionService sessionService) : AuthorizedController
    {
        [HttpPost]
        [ProducesResponseType(typeof(PitwallSession), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateSession()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pitwallSession = await sessionService.CreateSession();

            return Created("", pitwallSession);
        }
    }
}
