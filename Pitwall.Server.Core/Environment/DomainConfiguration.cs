using Microsoft.Extensions.Configuration;

namespace Pitwall.Server.Core.Environment
{
    public class DomainConfiguration : IDomainConfiguration
    {
        private readonly IConfiguration configuration;
        public DomainConfiguration(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public Uri WebAppDomain => new Uri(configuration["WebAppDomain"]);

        public Uri ApiUrl => new Uri(configuration["ApiDomain"]);
    }
}
