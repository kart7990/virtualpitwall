using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class CarTelemetry
    {
        private decimal fuelPercent;
        private decimal? fuelConsumedLap;

        public double Throttle { get; set; }
        public double Brake { get; set; }
        public double Clutch { get; set; }
        public double SteeringAngle { get; set; }
        public double RPM { get; set; }
        public double Speed { get; set; }
        public double FuelQuantity { get; set; }
        public decimal FuelPercent { get => Truncate(fuelPercent, 4); set => fuelPercent = value; }
        public decimal? FuelConsumedLap
        {
            get
            {
                if (fuelConsumedLap.HasValue)
                {
                    return Truncate(fuelConsumedLap.Value, 4);
                }
                else
                {
                    return null;
                }
            }
            set => fuelConsumedLap = value;
        }
        public double FuelPressure { get; set; }
        public double OilTemp { get; set; }
        public double OilPressure { get; set; }
        public double WaterTemp { get; set; }
        public double Voltage { get; set; }

        private decimal Truncate(decimal d, byte decimals)
        {
            decimal r = Math.Round(d, decimals);

            if (d > 0 && r > d)
            {
                return r - new decimal(1, 0, 0, false, decimals);
            }
            else if (d < 0 && r < d)
            {
                return r + new decimal(1, 0, 0, false, decimals);
            }

            return r;
        }
    }
}
