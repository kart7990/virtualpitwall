using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Core.Models
{
    public class Condition
    {
        public double AirDensity { get; set; }
        public double AirPressure { get; set; }
        public double AirTemp { get; set; }
        public double FogLevel { get; set; }
        public string Skies { get; set; }
        public int WeatherType { get; set; }
        public double TrackTemp { get; set; }
        public string TrackUsage { get; set; }
        public double RelativeHumidity { get; set; }
        public string WindDirection { get; set; }
        public double WindSpeed { get; set; }
    }
}
