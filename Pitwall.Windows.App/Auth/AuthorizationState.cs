using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Pitwall.Windows.App.Auth
{
    public class AuthorizationState
    {
        public static string AccessToken { get; set; }
        public static bool IsLoggedIn { get => !string.IsNullOrEmpty(AccessToken); }
        public static IEnumerable<Claim> Claims
        {
            get
            {
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(AccessToken);

                return token.Claims;

            }
        }
        public static string Name
        {
            get => Claims.Single(c => c.Type == "name").Value;
        }
        public static void Logout()
        {
            AccessToken = null;
        }
    }
}
