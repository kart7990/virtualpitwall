using Pitwall.Server.Core.Authorization.Models;

namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizationService
    {
        Task<AuthorizationResult> AuthorizeOAuthUser(AuthorizeRequest loginExternal);
        Task<AuthorizationResult> AuthorizeTestUser();
    }
}