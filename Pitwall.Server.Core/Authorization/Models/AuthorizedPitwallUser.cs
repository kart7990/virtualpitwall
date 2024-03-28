using System.Security.Claims;

namespace Pitwall.Server.Core.Authorization.Models
{
    public class AuthorizedPitwallUser : IAuthorizedPitwallUser
    {
        private ClaimsPrincipal claimsPrincipal;

        public AuthorizedPitwallUser(IHttpContextUser httpContextUser)
        {
            //Get user from http context - might be null if web socket connection
            var principal = httpContextUser.GetHttpContextUserClaimsPrincipal();

            if (principal != null)
            {
                claimsPrincipal = principal;
            }
        }

        public ClaimsPrincipal ClaimsPrincipal
        {
            get
            {
                if (claimsPrincipal == null)
                {
                    // User get user from provider (web socket connection)
                    if (ClaimsPrincipalProvider != null)
                    {
                        claimsPrincipal = ClaimsPrincipalProvider.Invoke();
                    }
                    else
                    {
                        throw new InvalidOperationException("User must be authorized in http context or ClaimsPrincipalProvider must be set for other connection types like web sockets.");
                    }
                }
                return claimsPrincipal;
            }
        }

        public Guid Id => Guid.Parse(claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public string Email => claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.Email).Value;

        public string Name => claimsPrincipal.Claims.Single(c => c.Type == "name").Value;

        public Func<ClaimsPrincipal> ClaimsPrincipalProvider { get; set; }

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
