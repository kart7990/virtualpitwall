using JWT.Algorithms;
using JWT.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Authentication
{
    public static class AuthenticationState
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
