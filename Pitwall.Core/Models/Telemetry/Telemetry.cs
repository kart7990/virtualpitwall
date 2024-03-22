using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class Telemetry
    {
        public CarTelemetry Car { get; set; }
        public TimingTelemetry Timing { get; set; }
    }
}
