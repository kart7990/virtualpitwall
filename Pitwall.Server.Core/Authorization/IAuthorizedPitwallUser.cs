using System.Security.Claims;

namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizedPitwallUser : IPitwallUser
    {
        Func<ClaimsPrincipal> ClaimsPrincipalProvider { get; set; }
    }
}
