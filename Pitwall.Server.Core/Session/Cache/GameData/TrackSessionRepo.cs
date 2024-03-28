using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Server.Core.Session.Cache.GameData
{
    public class TrackSessionRepo
    {
        private readonly IDatabase cache;
        private readonly CompletedLapsRepo completedLapsRepo;
        private readonly ConditionsRepo conditionsRepo;

        public TrackSessionRepo(IDatabase cache, CompletedLapsRepo completedLapsRepo, ConditionsRepo conditionsRepo)
        {
            this.cache = cache;
            this.completedLapsRepo = completedLapsRepo;
            this.conditionsRepo = conditionsRepo;
        }

        public async Task Add(string dataProviderId, string gameAssignedSessionId, BaseTrackSession trackSession)
        {
            var collectionKey = BuildCollectionKey(dataProviderId, gameAssignedSessionId);
            var keyExists = await cache.KeyExistsAsync(collectionKey);

            var isNewTrackSession = await cache.SetAddAsync(collectionKey, trackSession.Number);

            await cache.StringSetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSession.Number.ToString()), JsonConvert.SerializeObject(trackSession), TimeSpan.FromHours(30));

            if (!isNewTrackSession)
            {
                await completedLapsRepo.Delete(dataProviderId, gameAssignedSessionId, trackSession.Number);
                //await conditionsRepo.Delete(dataProviderId, trackSession.Number);
                //await conditionsRepo.DeleteHistory(dataProviderId, trackSession.Number);
            }

            if (!keyExists)
            {
                await cache.KeyExpireAsync(collectionKey, TimeSpan.FromHours(30));
            }
        }

        public async Task Update(string dataProviderId, string gameAssignedSessionId, BaseTrackSession trackSession)
        {
            await cache.StringSetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSession.Number.ToString()), JsonConvert.SerializeObject(trackSession), TimeSpan.FromHours(30));
        }

        public async Task<TrackSession> Get(string dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var trackSessionJson = await cache.StringGetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSessionNumber.ToString()));
            var trackSession = JsonConvert.DeserializeObject<TrackSession>(trackSessionJson);

            trackSession.CompletedLaps = await completedLapsRepo.GetRange(dataProviderId, gameAssignedSessionId, trackSession.Number, 0);
            trackSession.CurrentConditions = await conditionsRepo.Get(dataProviderId, gameAssignedSessionId, trackSession.Number);
            trackSession.ConditionHistory = await conditionsRepo.GetHistory();

            return trackSession;
        }

        public async Task<TrackSession> GetBase(string dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var trackSessionJson = await cache.StringGetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSessionNumber.ToString()));
            var trackSession = JsonConvert.DeserializeObject<TrackSession>(trackSessionJson);

            return trackSession;
        }

        public async Task<List<TrackSession>> GetAll(string dataProviderId, string gameAssignedSessionId)
        {
            var trackSessions = new List<TrackSession>();
            var sessionNumbers = await cache.SetMembersAsync(BuildCollectionKey(dataProviderId, gameAssignedSessionId));

            foreach (var trackSessionNumber in sessionNumbers)
            {
                trackSessions.Add(await Get(dataProviderId, gameAssignedSessionId, Convert.ToInt32(trackSessionNumber)));
            }

            return trackSessions;
        }

        private string BuildKey(string providerId, string gameAssignedSessionId, string trackSessionNumber)
        {
            return "ts:pid#" + providerId + "gasid#" + gameAssignedSessionId + "sn#" + trackSessionNumber;
        }

        private string BuildCollectionKey(string providerId, string gameAssignedSessionId)
        {
            return "tsc:pid#" + providerId + "gasid#" + gameAssignedSessionId;
        }
    }
}
