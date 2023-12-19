using System;
using System.Collections.Generic;
using System.Text;

namespace SimPitBox.Core.Models
{
    public class RealTimeSessionData
    {
        public int SessionNumber { get; set; }
        public string SessionState { get; set; }
        public string Flags { get; set; }
        public int SessionLapsRemaining { get; set; }
        public bool IsActive { get; set; }
        public bool IsCarTelemetryActive { get; set; }
        public SessionTiming Timing { get; set; }
        public Condition Conditions { get; set; }
        public List<Standing> Standings { get; set; }
    }
}
