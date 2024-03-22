using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class TelemetryProvider : BaseTelemetryProvider
    {
        public Telemetry Telemetry { get; set; }

        public List<CompletedLapDetails> CompletedLapsDetails = new List<CompletedLapDetails>();
    }
}
