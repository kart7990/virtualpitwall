using Newtonsoft.Json;
using StackExchange.Redis;

namespace Pitwall.Server.Core.Session.Cache.Telemetry
{
    public class TelemetryRepo
    {
        private readonly IDatabase cache;

        public TelemetryRepo(IDatabase cache)
        {
            this.cache = cache;
        }

        public async Task Set(string telemetryProviderId, Pitwall.Core.Models.Telemetry.Telemetry telemetry)
        {
            await cache.StringSetAsync(BuildKey(telemetryProviderId), JsonConvert.SerializeObject(telemetry), TimeSpan.FromSeconds(30));
        }

        public async Task<Pitwall.Core.Models.Telemetry.Telemetry> Get(string telemetryProviderId)
        {
            var telemetry = new Pitwall.Core.Models.Telemetry.Telemetry();

            var data = await cache.StringGetAsync(BuildKey(telemetryProviderId));

            if (data.HasValue)
            {
                telemetry = JsonConvert.DeserializeObject<Pitwall.Core.Models.Telemetry.Telemetry>(data);
            }

            return telemetry;
        }

        public async Task Delete(string telemetryProviderId)
        {
            await cache.KeyDeleteAsync(BuildKey(telemetryProviderId));
        }

        private string BuildKey(string telemetryProviderId)
        {
            return "t:tpid#" + telemetryProviderId;
        }
    }
}