using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Windows.Core.Models
{
    public class SessionTiming
    {
        public double RaceTimeRemaining { get; set; }
        public double EstimatedRaceLaps { get; set; }
        public int EstimatedWholeRaceLaps { get; set; }
        public double LeaderLapsRemaining { get; set; }
        public int LeaderWholeLapsRemaining { get; set; }
        public long SimDateTime { get; set; }
    }
}
