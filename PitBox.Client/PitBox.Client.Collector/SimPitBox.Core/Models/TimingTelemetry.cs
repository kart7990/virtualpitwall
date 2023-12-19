using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Core.Models
{
    public class TimingTelemetry
    {
        public int DriverCurrentLap { get; set; } = -1;
        public int Incidents { get; set; } = 0;
        public double DriverLapsComplete { get; set; } = -1;
        public double CurrentLapTime { get; set; }
        public double LapDeltaToSessionBestLap { get; set; }
        public double LapDistancePercentage { get; set; }
    }
}
