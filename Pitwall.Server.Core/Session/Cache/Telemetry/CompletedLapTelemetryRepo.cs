using Newtonsoft.Json;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Server.Core.Session.Cache.Telemetry
{
    public class CompletedLapTelemetryRepo
    {
        private readonly IDatabase cache;

        public CompletedLapTelemetryRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task Add(string providerId, string gameAssignedSessionId, int trackSessionNumber, double simTimestamp, CompletedLapDetails completedLap)
        {
            var key = BuildKey(providerId, gameAssignedSessionId, trackSessionNumber);
            var keyExists = await cache.KeyExistsAsync(key);

            await cache.SortedSetAddAsync(key, JsonConvert.SerializeObject(completedLap), simTimestamp);

            if (!keyExists)
            {
                await cache.KeyExpireAsync(key, TimeSpan.FromHours(30));
            }
        }

        public async Task<CompletedTelemetryLaps> GetRange(string providerId, string gameAssignedSessionId, int trackSessionNumber, double lastUpdateGameTime)
        {
            var laps = new List<CompletedLapDetails>();
            var lapsSinceLastUpdate = await cache.SortedSetRangeByScoreWithScoresAsync(BuildKey(providerId, gameAssignedSessionId, trackSessionNumber), lastUpdateGameTime, exclude: Exclude.Start);

            double latestLapTimestamp = lastUpdateGameTime;

            foreach (var lapEntry in lapsSinceLastUpdate)
            {
                if (lapEntry.Score > latestLapTimestamp)
                {
                    latestLapTimestamp = lapEntry.Score;
                }
                laps.Add(JsonConvert.DeserializeObject<CompletedLapDetails>(lapEntry.Element));
            }

            return new CompletedTelemetryLaps() { LastUpdate = latestLapTimestamp, Laps = laps };
        }

        public async Task Delete(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            await cache.KeyDeleteAsync(BuildKey(providerId, gameAssignedSessionId, trackSessionNumber));
        }

        private string BuildKey(string providerId, string gameAssignedSessionId, int trackSessionNumber)
        {
            return "clt:pid#" + providerId + ":gsid#" + gameAssignedSessionId + "tsn#" + trackSessionNumber;
        }
    }
}