using System.Security.Claims;

namespace Pitwall.Server.Core.Authorization.Models
{
    public interface IHttpContextUser
    {
        public ClaimsPrincipal GetHttpContextUserClaimsPrincipal();
    }
}
