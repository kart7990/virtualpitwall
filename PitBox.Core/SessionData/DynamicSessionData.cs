using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class DynamicSessionData
    {
        public int SessionNumber { get; set; }
        public string SessionState { get; set; }
        public string Flags { get; set; }
        public int SessionLapsRemaining { get; set; }
        public bool IsActive { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsCarTelemetryActive { get; set; }
        public SessionTiming Timing { get; set; }
        public Conditions Conditions { get; set; }
    }
}
