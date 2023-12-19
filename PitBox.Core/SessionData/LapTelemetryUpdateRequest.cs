using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class LapTelemetryUpdateRequest : BasePitBoxMessage
    {
        public int LastLapNumber { get; set; }
        public int SessionNumber { get; set; }
    }
}
