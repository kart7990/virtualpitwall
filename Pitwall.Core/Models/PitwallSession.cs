using System;
using System.Collections.Generic;
using System.Text;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;

namespace Pitwall.Core.Models
{
    public class PitwallSession
    {
        public string Id { get; set; }
        public string TeamId { get; set; }
        public string AccessCode { get; set; }
        public Guid CreatorUserId { get; set; }
        public List<BaseGameDataProvider> GameDataProviders { get; set; } = new List<BaseGameDataProvider>();
        public List<BaseTelemetryProvider> TelemetryProviders { get; set; } = new List<BaseTelemetryProvider>();
    }
}
