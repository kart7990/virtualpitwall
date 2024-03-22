using Newtonsoft.Json;
using PitBox.Server.Core.Data.Cache.GameData;
using PitBox.Server.Core.Data.Cache.Telemetry;
using Pitwall.Core.Models;
using StackExchange.Redis;

namespace PitBox.Server.Core.Data.Cache
{
    public class PitwallSessionRepo
    {
        private readonly IDatabase cache;
        private readonly GameDataProviderRepo gameDataProviderRepo;
        private readonly TelemetryProviderRepo telemetryProviderRepo;

        public PitwallSessionRepo(IDatabase cache, GameDataProviderRepo gameDataProviderRepo, TelemetryProviderRepo telemetryProviderRepo)
        {
            this.cache = cache;
            this.gameDataProviderRepo = gameDataProviderRepo;
            this.telemetryProviderRepo = telemetryProviderRepo;
        }

        public async Task Add(PitwallSession pitwallSession)
        {
            await cache.StringSetAsync(BuildKey(pitwallSession.Id), JsonConvert.SerializeObject(pitwallSession), TimeSpan.FromHours(30));
        }

        public async Task<PitwallSession> Get(string pitwallSessionId)
        {
            var sessionJsonResult = await cache.StringGetAsync(BuildKey(pitwallSessionId));
            if (sessionJsonResult.HasValue)
            {
                var session = JsonConvert.DeserializeObject<PitwallSession>(sessionJsonResult);
                session.GameDataProviders = await gameDataProviderRepo.GetAll(pitwallSessionId);
                session.TelemetryProviders = await telemetryProviderRepo.GetAll(pitwallSessionId);
                return session;
            }
            else
            {
                return null;
            }
        }

        public async Task Delete(string pitwallSessionId)
        {
            await cache.KeyDeleteAsync(BuildKey(pitwallSessionId));
        }

        private string BuildKey(string pitwallSessionId)
        {
            return "psid#" + pitwallSessionId;
        }

    }
}
