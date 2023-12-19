using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class Telemetry
    {
        public CarTelemetry CarTelemetry { get; set; }
        public TimingTelemetry TimingTelemetry { get; set; }
    }
}
