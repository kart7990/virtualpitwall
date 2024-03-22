using Pitwall.Server.Core.Authorization.Models;

namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizationService
    {
        Task<JsonWebToken> AuthorizeLocalUser(IAuthorizedPitwallUser authorizedPitwallUser);
    }
}