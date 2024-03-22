using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PitBox.Server.Core.Data.Cache;
using PitBox.Server.Core.Data.Cache.GameData;
using PitBox.Server.Core.Data.Cache.Telemetry;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Database;
using Pitwall.Server.Core.Environment;
using Pitwall.Server.Core.Session;
using StackExchange.Redis;

namespace Pitwall.Server.Core
{
    public static class ServicesProvider
    {
        public static void AddServices<User>(this IServiceCollection serviceCollection, Action<DbContextOptionsBuilder> dbOptionsAction, string redisConnectionString, bool transientDb = false)
            where User : class, IAuthorizedPitwallUser
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
            serviceCollection.AddScoped<IAuthorizedPitwallUser, User>();
            serviceCollection.AddTransient<IAuthorizationService, LocalAuthorizationService>();
            serviceCollection.AddTransient<IAuthorizationConfiguration, AuthorizationConfiguration>();
            serviceCollection.AddTransient<IDomainConfiguration, DomainConfiguration>();
            #endregion

            #region Services
            serviceCollection.AddTransient<SessionService>();
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
            #endregion
        }
    }
}
