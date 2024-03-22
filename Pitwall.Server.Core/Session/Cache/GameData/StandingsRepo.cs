using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitBox.Server.Core.Data.Cache.GameData
{
    public class StandingsRepo
    {
        private readonly IDatabase cache;

        public StandingsRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task Set(string dataProviderId, List<Standing> standings)
        {
            await cache.StringSetAsync(BuildKey(dataProviderId), JsonConvert.SerializeObject(standings), TimeSpan.FromSeconds(30));
        }

        public async Task<List<Standing>> Get(string dataProviderId)
        {
            var standings = new List<Standing>();

            var data = await cache.StringGetAsync(BuildKey(dataProviderId));

            if (data.HasValue)
            {
                standings = JsonConvert.DeserializeObject<List<Standing>>(data);
            }

            return standings;
        }

        public async Task Delete(string pitboxSessionId)
        {
            await cache.KeyDeleteAsync(BuildKey(pitboxSessionId));
        }

        private string BuildKey(string pitboxSessionId)
        {
            return "s:pid#" + pitboxSessionId;
        }
    }
}
