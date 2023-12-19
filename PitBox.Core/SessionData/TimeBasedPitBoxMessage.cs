using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class TimeBasedPitBoxMessage : BasePitBoxMessage
    {
        public double SessionElapsedTime { get; set; }
        public int SessionNumber { get; set; }
    }
}
