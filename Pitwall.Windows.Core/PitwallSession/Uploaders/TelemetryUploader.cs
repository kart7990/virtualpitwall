using iRacingSdkWrapper;
using iRacingSimulator;
using Pitwall.Core.Models.DataTransfer;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    internal class TelemetryUploader : BackPressureGuardedIntervalUploader<TelemetryInfo, PitwallMessage<Pitwall.Core.Models.Telemetry.Telemetry>>
    {
        private readonly LapTelemetryManager lapTelemetryManager;
        private readonly DataPublisherConnection publisherConnection;

        public TelemetryUploader(LapTelemetryManager lapTelemetryManager, DataPublisherConnection publisherConnection, int minIntervalMs = 100)
            : base(publisherConnection.Connection, "UpdateTelemetry", "TelemetryUpdated", minIntervalMs)
        {
            this.lapTelemetryManager = lapTelemetryManager;
            this.publisherConnection = publisherConnection;
        }

        public override bool TelemetryUpdateRequiresActiveSession => true;
        public override bool RequiresCarOnTrack => true;

        public override void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            RunIfIntervalElapsed(telemetryInfo);
        }

        public override PitwallMessage<Pitwall.Core.Models.Telemetry.Telemetry> GetDataForUpload(TelemetryInfo telemetryInfo)
        {
            var lapFuelConsumed = lapTelemetryManager.CurrentLapTelemetry?.FuelLapStart - telemetryInfo.FuelLevel.Value;
            var telemetry = new Pitwall.Core.Models.Telemetry.Telemetry()
            {
                Car = new Pitwall.Core.Models.Telemetry.CarTelemetry()
                {
                    Speed = Math.Round(telemetryInfo.Speed.Value, 3),
                    RPM = Math.Round(telemetryInfo.RPM.Value),
                    Throttle = Math.Round(telemetryInfo.Throttle.Value * 100),
                    Brake = Math.Round(telemetryInfo.Brake.Value * 100),
                    Clutch = Math.Round(100 - (telemetryInfo.Clutch.Value * 100)),
                    SteeringAngle = Math.Round(telemetryInfo.SteeringWheelAngle.Value, 3),
                    FuelPercent = Convert.ToDecimal(telemetryInfo.FuelLevelPct.Value),
                    FuelQuantity = Math.Round(telemetryInfo.FuelLevel.Value, 3),
                    FuelConsumedLap = Convert.ToDecimal(lapFuelConsumed),
                    FuelPressure = Math.Round(telemetryInfo.FuelPress.Value, 3),
                    OilPressure = Math.Round(telemetryInfo.OilPress.Value, 3),
                    OilTemp = Math.Round(telemetryInfo.OilTemp.Value, 3),
                    WaterTemp = Math.Round(telemetryInfo.WaterTemp.Value, 3),
                    Voltage = Math.Round(telemetryInfo.Voltage.Value, 3)
                },
                Timing = new Pitwall.Core.Models.Telemetry.TimingTelemetry()
                {
                    CurrentLapTime = telemetryInfo.LapCurrentLapTime.Value,
                    LapDeltaToSessionBestLap = telemetryInfo.LapDeltaToSessionBestLap.Value,
                    LapDistancePercentage = telemetryInfo.LapDistPct.Value,
                    Incidents = telemetryInfo.PlayerCarTeamIncidentCount.Value
                }
            };
            if (Sim.Instance.Driver?.CurrentResults != null)
            {
                telemetry.Timing.DriverCurrentLap = telemetryInfo.Lap.Value;
                telemetry.Timing.DriverLapsComplete = Sim.Instance.Driver.CurrentResults.LapsComplete;
                //realTimeTelemetry.TimingTelemetry.DriverLapsRemaining = trackEvent.CurrentSession.IsRace ? (trackEvent.CurrentSession.IsFixedLaps ? Convert.ToInt32(trackEvent.CurrentSession.RaceLaps) - telemetryInfo.Lap.Value : realTimeSessionDataTask.SessionTiming.EstimatedWholeRaceLaps - telemetryInfo.Lap.Value) : Convert.ToInt32(Math.Ceiling(telemetryInfo.SessionTimeRemain.Value / Sim.Instance.Driver.CurrentResults.FastestTime.Time.TotalSeconds));
            }

            var message = new PitwallMessage<Pitwall.Core.Models.Telemetry.Telemetry>()
            {
                Data = telemetry,
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                SessionId = PitwallDataEngine.PitwallSesisonId,
                ProviderId = publisherConnection.ProviderId,
                GameAssignedSessionId = telemetryInfo.SessionUniqueID.Value.ToString(),
                SessionNumber = telemetryInfo.SessionNum.Value
            };

            return message;
        }
    }
}
