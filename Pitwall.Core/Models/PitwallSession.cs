using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using System.Text.Json.Serialization;

namespace Pitwall.Core.Models
{
    public class PitwallSession
    {
        public string Id { get; set; }
        [JsonIgnore]
        public string TeamId { get; set; }
        [JsonIgnore]
        public string AccessCode { get; set; }
        public Guid CreatorUserId { get; set; }
        public List<BaseGameDataProvider> GameDataProviders { get; set; } = new List<BaseGameDataProvider>();
        public List<BaseTelemetryProvider> TelemetryProviders { get; set; } = new List<BaseTelemetryProvider>();
    }
}
