using Pitwall.Core.Models.GameData;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class CompletedTelemetryLaps
    {
        public List<CompletedLapDetails> Laps { get; set; } = new List<CompletedLapDetails>();
        /// <summary>
        /// Game time of last lap received, used for incremental updates.
        /// </summary>
        public double LastUpdate { get; set; }
    }
}
