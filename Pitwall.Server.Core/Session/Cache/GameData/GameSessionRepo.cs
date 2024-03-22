using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;

namespace PitBox.Server.Core.Data.Cache.GameData
{
    public class GameSessionRepo
    {
        private readonly IDatabase cache;
        private readonly TrackSessionRepo trackSessionRepo;

        public GameSessionRepo(IDatabase cache, TrackSessionRepo trackSessionRepo)
        {
            this.cache = cache;
            this.trackSessionRepo = trackSessionRepo;
        }

        public async Task Add(string dataProviderId, BaseGameSession gameSession)
        {
            var collectionKey = BuildCollectionKey(dataProviderId);
            var keyExists = await cache.KeyExistsAsync(collectionKey);

            var isNewTrackSession = await cache.SetAddAsync(collectionKey, gameSession.GameAssignedSessionId);


            await cache.StringSetAsync(BuildKey(dataProviderId, gameSession.GameAssignedSessionId), JsonConvert.SerializeObject(gameSession), TimeSpan.FromHours(30));
            //Delete track sessions if exists for gasid?
        }

        public async Task<List<string>> GetGameAssignedSessionIds(string dataProviderId)
        {
            return (await cache.SetMembersAsync(BuildCollectionKey(dataProviderId))).Select(e => e.ToString()).ToList();
        }

        public async Task<GameSession> Get(string dataProviderId, string gameAssignedSessionId)
        {
            var data = await cache.StringGetAsync(BuildKey(dataProviderId, gameAssignedSessionId));
            if (data.HasValue)
            {
                var gameSession = JsonConvert.DeserializeObject<GameSession>(data);
                gameSession.TrackSessions = await trackSessionRepo.GetAll(dataProviderId, gameAssignedSessionId);
                return gameSession;
            }
            else
            {
                return null;
            }
        }

        public async Task<BaseGameSession> GetBase(string dataProviderId, string gameAssignedSessionId)
        {
            var data = await cache.StringGetAsync(BuildKey(dataProviderId, gameAssignedSessionId));
            var gameSession = JsonConvert.DeserializeObject<GameSession>(data);
            return gameSession;
        }

        public async Task Update(string dataProviderId, BaseGameSession gameSession)
        {
            await cache.StringSetAsync(BuildKey(dataProviderId, gameSession.GameAssignedSessionId), JsonConvert.SerializeObject(gameSession), TimeSpan.FromHours(30));
        }

        private string BuildKey(string providerId, string gameAssignedSessionId)
        {
            return "gs:pid#" + providerId + "gasid#" + gameAssignedSessionId;
        }

        private string BuildCollectionKey(string providerId)
        {
            return "gsc:pid#" + providerId;
        }

    }
}
