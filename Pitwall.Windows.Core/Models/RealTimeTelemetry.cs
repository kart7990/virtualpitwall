using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class RealTimeTelemetry
    {
        public CarTelemetry CarTelemetry { get; set; }
        public TimingTelemetry TimingTelemetry { get; set; }
    }
}
