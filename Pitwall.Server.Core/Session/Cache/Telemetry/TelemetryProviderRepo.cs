using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitBox.Server.Core.Data.Cache.Telemetry
{
    public class TelemetryProviderRepo
    {
        private readonly IDatabase cache;

        public TelemetryProviderRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task Add(string pitwallSessionId, BaseTelemetryProvider telemetryProvider)
        {
            var collectionKey = BuildCollectionKey(pitwallSessionId);
            var keyExists = await cache.KeyExistsAsync(collectionKey);

            var added = await cache.SetAddAsync(collectionKey, telemetryProvider.Id);

            if (added)
            {
                await cache.StringSetAsync(BuildKey(pitwallSessionId, telemetryProvider.Id), JsonConvert.SerializeObject(telemetryProvider), TimeSpan.FromHours(30));
            }

            if (!keyExists)
            {
                await cache.KeyExpireAsync(collectionKey, TimeSpan.FromHours(30));
            }
        }

        public async Task UpdateTelemetryProvider(string pitwallSessionId, string telemetryProviderId, BaseTelemetryProvider baseTelemetryProvider)
        {
            var telemetryProviderJson = await cache.StringGetAsync(BuildKey(pitwallSessionId, telemetryProviderId));
            var provider = JsonConvert.DeserializeObject<BaseTelemetryProvider>(telemetryProviderJson);

            provider.IsOnTrack = baseTelemetryProvider.IsOnTrack;
            provider.CarNumber = baseTelemetryProvider.CarNumber;
            provider.GameUserId = baseTelemetryProvider.GameUserId;
            provider.GameUserName = baseTelemetryProvider.GameUserName;

            await cache.StringSetAsync(BuildKey(pitwallSessionId, provider.Id), JsonConvert.SerializeObject(provider), TimeSpan.FromHours(30));
        }

        public async Task<BaseTelemetryProvider> Get(string pitwallSessionId, string telemetryProviderId)
        {
            var telemetryProviderJson = await cache.StringGetAsync(BuildKey(pitwallSessionId, telemetryProviderId));
            return JsonConvert.DeserializeObject<BaseTelemetryProvider>(telemetryProviderJson);
        }

        public async Task<List<BaseTelemetryProvider>> GetAll(string pitwallSessionId)
        {
            var telemetryProviders = new List<BaseTelemetryProvider>();
            var telemetryProviderIds = await cache.SetMembersAsync(BuildCollectionKey(pitwallSessionId));

            foreach (var telemetryProviderId in telemetryProviderIds)
            {
                telemetryProviders.Add(await Get(pitwallSessionId, telemetryProviderId));
            }

            return telemetryProviders;
        }

        public string BuildKey(string pitwallSessionId, string gameDataProviderId)
        {
            return "tp:psid#" + pitwallSessionId + ":tpid#" + gameDataProviderId;
        }

        public string BuildCollectionKey(string pitwallSessionId)
        {
            return "tpc:psid#" + pitwallSessionId;
        }
    }
}
