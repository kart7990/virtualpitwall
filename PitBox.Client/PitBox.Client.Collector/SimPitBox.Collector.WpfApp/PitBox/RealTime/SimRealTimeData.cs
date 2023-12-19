using iRacingSdkWrapper;
using iRacingSimulator;
using iRacingSimulator.Drivers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp
{
    public class SimRealTimeData
    {
        public TelemetryInfo Telemetry { get; set; }
        public SessionData SessionData { get; set; }
        public Driver Driver { get; set; }
        public Driver Leader { get; set; }
        public List<Driver> Drivers { get; set; }
    }
}
