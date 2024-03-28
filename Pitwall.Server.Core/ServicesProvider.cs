using Aydsko.iRacingData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Database;
using Pitwall.Server.Core.Environment;
using Pitwall.Server.Core.iRacingData;
using Pitwall.Server.Core.Session;
using Pitwall.Server.Core.Session.Cache;
using Pitwall.Server.Core.Session.Cache.GameData;
using Pitwall.Server.Core.Session.Cache.Telemetry;
using StackExchange.Redis;

namespace Pitwall.Server.Core
{
    public static class ServicesProvider
    {
        public static void AddServices<User>(this IServiceCollection serviceCollection, Action<DbContextOptionsBuilder> dbOptionsAction, string redisConnectionString, bool transientDb = false)
            where User : class, IPitwallUser
        {
            #region DB and Cache
            if (transientDb)
            {
                serviceCollection.AddDbContext<PitwallDbContext>(dbOptionsAction, ServiceLifetime.Transient);
            }
            else
            {
                serviceCollection.AddDbContext<PitwallDbContext>(dbOptionsAction);
            }

            serviceCollection.AddSingleton<IConnectionMultiplexer>(provider => ConnectionMultiplexer.Connect(ConfigurationOptions.Parse(redisConnectionString)));
            serviceCollection.AddScoped(provider => provider.GetService<IConnectionMultiplexer>().GetDatabase());
            #endregion

            #region Inf
            serviceCollection.AddScoped<IPitwallUser, User>();
            serviceCollection.AddTransient<IAuthorizationService, AuthorizationService>();
            serviceCollection.AddTransient<IAuthorizationConfiguration, AuthorizationConfiguration>();
            serviceCollection.AddTransient<IDomainConfiguration, DomainConfiguration>();
            #endregion

            #region Services
            serviceCollection.AddIRacingDataApi(options =>
            {
                options.UserAgentProductName = "VirtualPitwall";
                options.UserAgentProductVersion = new Version(1, 0);
            });

            serviceCollection.AddTransient<SessionService>();
            serviceCollection.AddTransient<iRacingDataClient>();
            #endregion

            #region Cache Repos
            serviceCollection.AddTransient<CompletedLapsRepo>();
            serviceCollection.AddTransient<ConditionsRepo>();
            serviceCollection.AddTransient<GameDataProviderRepo>();
            serviceCollection.AddTransient<TrackSessionRepo>();
            serviceCollection.AddTransient<CompletedLapTelemetryRepo>();
            serviceCollection.AddTransient<TelemetryProviderRepo>();
            serviceCollection.AddTransient<TelemetryRepo>();
            serviceCollection.AddTransient<PitwallSessionRepo>();
            serviceCollection.AddTransient<GameSessionRepo>();
            serviceCollection.AddTransient<StandingsRepo>();
            serviceCollection.AddTransient<iRacingDataRepository>();
            #endregion
        }
    }
}
