using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class CarTelemetry
    {
        public double Throttle { get; set; }
        public double Brake { get; set; }
        public double Clutch { get; set; }
        public double SteeringAngle { get; set; }
        public double RPM { get; set; }
        public double Speed { get; set; }
        public double FuelQuantity { get; set; }
        public double FuelPercent { get; set; }
        public double? CurrentLapTime { get; set; }
        public double? FuelConsumedLap { get; set; }
        public double FuelPressure { get; set; }
        public double OilTemp { get; set; }
        public double OilPressure { get; set; }
        public double WaterTemp { get; set; }
        public double Voltage { get; set; }
    }
}
