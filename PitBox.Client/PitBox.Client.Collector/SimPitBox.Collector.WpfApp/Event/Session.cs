using SimPitBox.Collector.WpfApp.Event.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Event
{
    public class Session
    {
        public int SessionId { get; set; }
        public string SessionType { get; set; }
        public string SessionName { get; set; }
        public string RaceLaps { get; set; }
        public double RaceTime { get; set; }
        public List<Car> Cars { get; } = new List<Car>();
        public List<Driver> Drivers { get; } = new List<Driver>();
    }
}
