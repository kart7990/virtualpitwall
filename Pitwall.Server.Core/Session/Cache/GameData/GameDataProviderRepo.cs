using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitBox.Server.Core.Data.Cache.GameData
{
    public class GameDataProviderRepo
    {
        private readonly IDatabase cache;
        private readonly GameSessionRepo gameSessionRepo;

        public GameDataProviderRepo(IDatabase cache, GameSessionRepo gameSessionRepo)
        {
            this.cache = cache;
            this.gameSessionRepo = gameSessionRepo;
        }

        public async Task Add(string pitwallSessionId, BaseGameDataProvider gameDataProvider)
        {
            var collectionKey = BuildCollectionKey(pitwallSessionId);
            var keyExists = await cache.KeyExistsAsync(collectionKey);

            var added = await cache.SetAddAsync(collectionKey, gameDataProvider.Id);

            await cache.StringSetAsync(BuildKey(pitwallSessionId, gameDataProvider.Id), JsonConvert.SerializeObject(gameDataProvider), TimeSpan.FromHours(30));

            if (!keyExists)
            {
                await cache.KeyExpireAsync(collectionKey, TimeSpan.FromHours(30));
            }
        }

        public async Task<BaseGameDataProvider> Get(string pitwallSessionId, string gameDataProviderId)
        {
            var gameDataProviderJson = await cache.StringGetAsync(BuildKey(pitwallSessionId, gameDataProviderId));
            var gameDataProvider = JsonConvert.DeserializeObject<BaseGameDataProvider>(gameDataProviderJson);
            gameDataProvider.GameAssignedSessionIds = await gameSessionRepo.GetGameAssignedSessionIds(gameDataProviderId);
            return gameDataProvider;
        }

        public async Task<List<BaseGameDataProvider>> GetAll(string pitwallSessionId)
        {
            var gameDataProviders = new List<BaseGameDataProvider>();
            var gameDataProviderIds = await cache.SetMembersAsync(BuildCollectionKey(pitwallSessionId));

            foreach (var gameDataProviderId in gameDataProviderIds)
            {
                gameDataProviders.Add(await Get(pitwallSessionId, gameDataProviderId));
            }

            return gameDataProviders;
        }

        private string BuildKey(string pitwallSessionId, string gameDataProviderId)
        {
            return "gdp:psid#" + pitwallSessionId + ":gdpid#" + gameDataProviderId;
        }

        private string BuildCollectionKey(string pitwallSessionId)
        {
            return "gdpc:psid#" + pitwallSessionId;
        }
    }
}
