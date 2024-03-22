using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class TrackSessionTelemetryData
    {
        public int TrackSessionNumber;
        public CompletedTelemetryLaps CompletedTelemetryLaps = new CompletedTelemetryLaps();
    }
}
