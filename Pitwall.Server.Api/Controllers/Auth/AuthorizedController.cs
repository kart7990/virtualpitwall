using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Pitwall.Server.Api.Controllers.Auth
{
    [Authorize]
    [ProducesResponseType(401)]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public abstract class AuthorizedController : ControllerBase
    {
    }
}