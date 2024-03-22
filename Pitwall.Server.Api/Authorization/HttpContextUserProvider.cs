using Pitwall.Server.Core.Authorization.Models;
using System.Security.Claims;

namespace Pitwall.Server.Api.Authorization
{
    public class HttpContextUserProvider(IHttpContextAccessor context) : IHttpContextUser
    {
        public ClaimsPrincipal GetHttpContextUserClaimsPrincipal()
        {
            if (context.HttpContext != null)
            {
                return context.HttpContext.User;
            }
            else
            {
                return null;
            }
        }

    }
}
