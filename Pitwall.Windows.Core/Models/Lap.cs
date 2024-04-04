
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class Lap
    {
        public int LapNumber { get; set; }
        public LapTime LapTime { get; set; }
        public int Position { get; set; }
        public int ClassPosition { get; set; }
        public string CarNumber { get; set; }
        public int DriverCustId { get; set; }
        public int SessionNumber { get; set; }
        public double RaceTimeRemaining { get; set; }
        public bool InPitLane { get; set; }
        public int PitStopCount { get; set; }
        public double SessionTimeLapStart { get; set; }
        public double SessionTimeLapEnd { get; set; }


        [JsonIgnore]
        public TrackSession Session { get; set; }
        [JsonIgnore]
        public Car Car { get; set; }
        [JsonIgnore]
        public Driver Driver { get; set; }
    }
}
