//using iRacingSdkWrapper;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace SimPitBox.Collector.WpfApp.Uploaders.Telemetry
//{
//    public class TelemetryIntervalUploader : IntervalUploader<TelemetryInfo, Telemetry>
//    {
//        private static readonly Func<TelemetryInfo, Telemetry> mapper = (raw) =>
//        {
//            var telemetry = new Telemetry()
//            {
//                IsOnTrack = raw.IsOnTrack.Value,
//                Speed = Math.Round(raw.Speed.Value, 3),
//                RPM = Math.Round(raw.RPM.Value),
//                Throttle = Math.Round(raw.Throttle.Value * 100),
//                Brake = Math.Round(raw.Brake.Value * 100),
//                Clutch = Math.Round(100 - (raw.Clutch.Value * 100)),
//                SteeringAngle = Math.Round(raw.SteeringWheelAngle.Value),
//                FuelPercent = Math.Round(raw.FuelLevelPct.Value, 2),
//                FuelQuantity = Math.Round(raw.FuelLevel.Value, 3),
//                FuelPressure = Math.Round(raw.FuelPress.Value, 3),
//                OilPressure = Math.Round(raw.OilPress.Value, 3),
//                OilTemp = Math.Round(raw.OilTemp.Value, 3),
//                WaterTemp = Math.Round(raw.WaterTemp.Value, 3),
//                Voltage = Math.Round(raw.Voltage.Value, 3)
//            };
//            return telemetry;
//        };

//        public TelemetryIntervalUploader(Uri uploadUri, int minIntervalMs) : base(uploadUri, minIntervalMs, mapper)
//        {
//        }
//    }
//}
