using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitBox.Server.Core.Data.Cache.GameData
{
    public class ConditionsRepo
    {
        private readonly IDatabase cache;

        public ConditionsRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task<Conditions> Get(string dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var data = await cache.StringGetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSessionNumber));
            if (data.HasValue)
            {
                return JsonConvert.DeserializeObject<Conditions>(data);
            }
            else
            {
                return null;
            }
        }

        public async Task Set(string dataProviderId, string gameAssignedSessionId, int trackSessionNumber, Conditions conditions)
        {
            await cache.StringSetAsync(BuildKey(dataProviderId, gameAssignedSessionId, trackSessionNumber), JsonConvert.SerializeObject(conditions), TimeSpan.FromSeconds(60));
            //TODO: impl condition history
        }

        public async Task<List<Conditions>> GetHistory()
        {
            //TODO: impl condition history
            return new List<Conditions>();
        }

        private async Task AddHistory()
        {
            //TODO: impl condition history
        }

        private string BuildKey(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            //Track session conditions: provider id: track session number
            return "tscn:pid#" + providerId + "gasid#" + gameAssignedSessionId + "tsn#" + trackSessionNumber;
        }

        private string BuildHistoryKey(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            //Track session conditions history: provider id: track session number
            return "tscnh:pid#" + providerId + "gasid#" + gameAssignedSessionId + "tsn#" + trackSessionNumber;
        }
    }
}
