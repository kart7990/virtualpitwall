using SimPitBox.Collector.WpfApp.Event;
using SimPitBox.Collector.WpfApp.PitBox.RealTime.Car;
using SimPitBox.Collector.WpfApp.Timing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.RealTime
{
    public class RealTimeData
    {
        public Telemetry CarTelemetry { get; set; }
        public Driver Driver { get; set; }
        public List<Standings.Standing> Standings { get; set; }
        public RaceDetails RaceDetails { get; set; }
    }
}
