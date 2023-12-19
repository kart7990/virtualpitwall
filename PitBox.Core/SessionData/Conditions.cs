using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class Conditions
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
