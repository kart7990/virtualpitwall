using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class Lap
    {
        public int LapNumber { get; set; }
        public long LapTime { get; set; }
        public int Stint { get; set; }
        public double SimTimeOfDay { get; set; }
        public Conditions Conditions { get; set; }
        public int Position { get; set; }
        public int ClassPosition { get; set; }
        public string DriverName { get; set; }
        public string CarNumber { get; set; }
        public int DriverCustId { get; set; }
        public int SessionNumber { get; set; }
        public double RaceTimeRemaining { get; set; }
        public bool InPitLane { get; set; }
        public int PitStopCount { get; set; }
        public double SessionTimeLapStart { get; set; }
        public double SessionTimeLapEnd { get; set; }
    }
}
