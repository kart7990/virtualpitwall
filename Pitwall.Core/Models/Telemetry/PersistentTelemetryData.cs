using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class PersistentTelemetryData
    {
        public List<TrackSessionTelemetryData> TrackSessions { get; set; } = new List<TrackSessionTelemetryData>();
    }
}
