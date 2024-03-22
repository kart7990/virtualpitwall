using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class CompletedLapDetails
    {
        public int LapNumber { get; set; }
        public int StintLapNumber { get; set; }
        public int SessionNumber { get; set; }
        public LapTime LapTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public double FuelLapStart { get; set; }
        public double FuelLapEnd { get; set; }
        public double FuelConsumed { get { return FuelLapStart - FuelLapEnd; } }
        public double MaxSpeed { get; set; }
        public double MinSpeed { get; set; }
        public double MaxRpm { get; set; }
        public double MinRpm { get; set; }
        public int IncidentCountLapStart { get; set; }
        public int IncidentCountLapEnd { get; set; }
        public bool InPitLane { get; set; }
        public bool GreenFlagFullLap { get; set; } = true;
        public int IncidentCount { get => IncidentCountLapEnd - IncidentCountLapStart; }
    }
}
