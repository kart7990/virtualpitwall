using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Server.Core.Session.Cache.GameData
{
    public class CompletedLapsRepo
    {
        private readonly IDatabase cache;

        public CompletedLapsRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task Add(string providerId, string gameAssignedSessionId, int trackSessionNumber, double simTimestamp, List<CompletedLap> completedLaps)
        {
            var key = BuildKey(providerId, gameAssignedSessionId, trackSessionNumber);
            var keyExists = await cache.KeyExistsAsync(key);

            foreach (var lap in completedLaps)
            {
                await cache.SortedSetAddAsync(key, JsonConvert.SerializeObject(lap), simTimestamp);
            }

            if (!keyExists)
            {
                await cache.KeyExpireAsync(key, TimeSpan.FromHours(30));
            }
        }

        public async Task<CompletedLaps> GetRange(string providerId, string gameAssignedSessionId, int trackSessionNumber, double lastUpdateGameTime)
        {
            var laps = new List<CompletedLap>();
            var lapsSinceLastUpdate = await cache.SortedSetRangeByScoreWithScoresAsync(BuildKey(providerId, gameAssignedSessionId, trackSessionNumber), lastUpdateGameTime, exclude: Exclude.Start);

            double latestLapTimestamp = lastUpdateGameTime;

            foreach (var lapEntry in lapsSinceLastUpdate)
            {
                if (lapEntry.Score > latestLapTimestamp)
                {
                    latestLapTimestamp = lapEntry.Score;
                }
                laps.Add(JsonConvert.DeserializeObject<CompletedLap>(lapEntry.Element));
            }

            return new CompletedLaps() { LastUpdate = latestLapTimestamp, Laps = laps };
        }

        public async Task Delete(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            await cache.KeyDeleteAsync(BuildKey(providerId, gameAssignedSessionId, trackSessionNumber));
        }

        private string BuildKey(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            return "tsl:pid#" + providerId + "gasid#" + gameAssignedSessionId + "tsn#" + trackSessionNumber;
        }
    }
}
