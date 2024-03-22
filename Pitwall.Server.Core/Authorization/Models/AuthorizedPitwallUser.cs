using System.Security.Claims;

namespace Pitwall.Server.Core.Authorization.Models
{
    public class AuthorizedPitwallUser(IHttpContextUser httpContextUser) : IAuthorizedPitwallUser
    {
        private ClaimsPrincipal claimsPrincipal = httpContextUser.GetHttpContextUserClaimsPrincipal();

        public Guid Id => Guid.Parse(claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public string Email => claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.Email).Value;

        public string Name => claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.Name).Value;

        public Claim GetClaim(string type)
        {
            return claimsPrincipal.Claims.SingleOrDefault(t => t.Type == type);
        }

        public bool HasClaim(string type, string value)
        {
            return claimsPrincipal.HasClaim(type, value);
        }

        public bool IsInRole(string role)
        {
            return claimsPrincipal.IsInRole(role);
        }
    }
}
