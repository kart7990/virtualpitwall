using JWT.Algorithms;
using JWT.Builder;

namespace Pitwall.Windows.App.Auth
{
    public class AuthorizationState
    {
        public static string AccessToken { get; set; }
        public static bool IsLoggedIn { get => !string.IsNullOrEmpty(AccessToken); }
        public static IDictionary<string, object> Claims
        {
            get => JwtBuilder.Create().WithAlgorithm(new HMACSHA256Algorithm()).Decode<IDictionary<string, object>>(AccessToken);
        }
        public static string Name
        {
            get => Claims["name"].ToString();
        }
        public static void Logout()
        {
            AccessToken = null;
        }
    }
}
