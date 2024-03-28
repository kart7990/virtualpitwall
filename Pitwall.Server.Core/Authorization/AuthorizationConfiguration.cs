using Microsoft.Extensions.Configuration;

namespace Pitwall.Server.Core.Authorization
{
    public class AuthorizationConfiguration : IAuthorizationConfiguration
    {
        private readonly IConfiguration configuration;

        public AuthorizationConfiguration(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string JwtKey => configuration["JwtKey"];

        public string JwtIssuer => configuration["JwtIssuer"];

        public string JwtAudience => configuration["JwtAudience"];

        public int JwtWebExpireSeconds => Convert.ToInt32(configuration["JwtExpireSeconds"]);

        public bool IsTestUserEnabled => Convert.ToBoolean(configuration["IsTestUserEnabled"]);
    }
}
