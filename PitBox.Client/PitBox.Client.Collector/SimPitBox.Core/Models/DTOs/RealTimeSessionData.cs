using System;
using System.Collections.Generic;
using System.Text;

namespace SimPitBox.Core.Models.DTOs
{
    public class RealTimeSessionData
    {
        public bool IsCarTelemetryLive { get; set; }
        public bool IsFinished { get; set; }
        public List<Standing> Standings { get; set; }
        public Condition Conditions { get; set; }
    }
}
