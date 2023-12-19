using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Core.Models
{
    public class Standing
    {
        public int Position { get; set; }
        public int ClassPosition { get; set; }
        public int StandingPosition { get; set; }
        public int StandingClassPosition { get; set; }
        public string CarNumber { get; set; }
        public string ClassName { get; set; }
        public int ClassId { get; set; }
        public string ClassColor { get; set; }
        public string CarName { get; set; }
        public bool IsCurrentDriver { get; set; }
        public int iRating { get; set; }
        public string SR { get; set; }
        public string DriverName { get; set; }
        public string DriverShortName { get; set; }
        public double LapDistancePercent { get; set; }
        public string TeamName { get; set; }
        public string LeaderDelta { get; set; }
        public string NextCarDelta { get; set; }
        public LapTime LastLaptime { get; set; }
        public LapTime BestLaptime { get; set; }
        public int? Lap { get; set; }
        public int? PitStopCount { get; set; }
        public int? StintLapCount { get; set; }
        public bool? IsInPitLane { get; set; } = false;
        public int? PitEntryCount { get; set; } = 0;
        public double? LastPitStopTime { get; set; }
    }
}
