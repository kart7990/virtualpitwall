using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class CompletedLap
    {
        public int LapNumber { get; set; }
        public long LapTime { get; set; }
        public int Stint { get; set; }
        public int Position { get; set; }
        public int ClassPosition { get; set; }
        public string DriverName { get; set; }
        public string CarNumber { get; set; }
        public int DriverCustId { get; set; }
        public int TrackSessionNumber { get; set; }
        public double RaceTimeRemaining { get; set; }
        public bool InPitLane { get; set; }
        public int PitStopCount { get; set; }
        public double GameDateTimeLapStart { get; set; }
        public double SessionTimeLapStart { get; set; }
        public double SessionTimeLapEnd { get; set; }
        public string ConditionsIdLapStart { get; set; }
        public string ConditionsIdLapEnd { get; set; }
    }
}
