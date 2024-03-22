using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class TimingTelemetry
    {
        public int DriverCurrentLap { get; set; }
        public int Incidents { get; set; }
        public double DriverLapsComplete { get; set; }
        public double CurrentLapTime { get; set; }
        public double LapDeltaToSessionBestLap { get; set; }
        public double LapDistancePercentage { get; set; }
    }
}
