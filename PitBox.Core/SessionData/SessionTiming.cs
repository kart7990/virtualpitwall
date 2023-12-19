using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class SessionTiming
    {
        public double SessionTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public double EstimatedRaceLaps { get; set; }
        public int EstimatedWholeRaceLaps { get; set; }
        public double LeaderLapsRemaining { get; set; }
        public int LeaderWholeLapsRemaining { get; set; }
        public double SimTimeOfDay { get; set; }
        public string SimDate { get; set; }
    }
}
