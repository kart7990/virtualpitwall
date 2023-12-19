using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Timing
{
    public class Driver
    {
        public string Name { get; set; }
        public int LapsCompleted { get; set; }
        public double BestLapTime { get; set; }
        public double LastLapTime { get; set; }
        public double CurrentLapTime { get; set; }
        public double CurrentLapNumber { get; set; }
        public double LapDeltaToSessionBestLap { get; set; }
        public double LapDeltaToSessionLastLap { get; set; }
        public int Position { get; set; } = -1;
        public int ClassPosition { get; set; }
        public int DriverLapsRemaining { get; set; } = -1;
        public double DriverLapsComplete { get; set; } = -1;
        //public int DriverWholeLapsRemaining
        //{
        //    get
        //    {
        //        return DriverLapsRemaining == -1 ? -1 : Convert.ToInt32(Math.Ceiling(DriverLapsRemaining));
        //    }
        //}
    }
}
