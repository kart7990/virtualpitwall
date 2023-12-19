using iRacingSdkWrapper;
using SimPitBox.iRacing.Services;
using SimPitBox.iRacing.Tasks.Telemetry.Lap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimPitBox.Core.Models;
using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using PitBox.Core.SessionData;

namespace SimPitBox.iRacing.Tasks.Telemetry.RealTime
{
    public class RealTimeTelemetryUploaderTask : HubIntervalUploadTask<TelemetryInfo, PitBoxMessage<PitBox.Core.SessionData.Telemetry>>, ITelemetryTask
    {
        private readonly LapTelemetryTask lapTelemetryTask;

        public RealTimeTelemetryUploaderTask(LapTelemetryTask lapTelemetryTask, HubConnection telemetryHubConnection, int minIntervalMs = 100)
            : base(telemetryHubConnection, "UpdateTelemetry", "onTelemetryReceived", minIntervalMs)
        {
            this.lapTelemetryTask = lapTelemetryTask;
        }

        public bool TelemetryUpdateRequiresActiveSession => true;
        public bool RequiresCarOnTrack => true;

        public void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            RunIfIntervalElapsed(telemetryInfo);
        }

        public override PitBoxMessage<PitBox.Core.SessionData.Telemetry> GetDataForUpload(TelemetryInfo telemetryInfo)
        {
            var lapFuelConsumed = lapTelemetryTask.CurrentLapTelemetry?.FuelLapStart - telemetryInfo.FuelLevel.Value;
            var realTimeTelemetry = new RealTimeTelemetry()
            {
                CarTelemetry = new Core.Models.CarTelemetry()
                {
                    Speed = Math.Round(telemetryInfo.Speed.Value, 3),
                    RPM = Math.Round(telemetryInfo.RPM.Value),
                    Throttle = Math.Round(telemetryInfo.Throttle.Value * 100),
                    Brake = Math.Round(telemetryInfo.Brake.Value * 100),
                    Clutch = Math.Round(100 - (telemetryInfo.Clutch.Value * 100)),
                    SteeringAngle = Math.Round(telemetryInfo.SteeringWheelAngle.Value, 3),
                    FuelPercent = telemetryInfo.FuelLevelPct.Value,
                    FuelQuantity = Math.Round(telemetryInfo.FuelLevel.Value, 3),
                    FuelConsumedLap = lapFuelConsumed,
                    FuelPressure = Math.Round(telemetryInfo.FuelPress.Value, 3),
                    OilPressure = Math.Round(telemetryInfo.OilPress.Value, 3),
                    OilTemp = Math.Round(telemetryInfo.OilTemp.Value, 3),
                    WaterTemp = Math.Round(telemetryInfo.WaterTemp.Value, 3),
                    Voltage = Math.Round(telemetryInfo.Voltage.Value, 3)
                },
                TimingTelemetry = new Core.Models.TimingTelemetry()
                {
                    CurrentLapTime = telemetryInfo.LapCurrentLapTime.Value,
                    LapDeltaToSessionBestLap = telemetryInfo.LapDeltaToSessionBestLap.Value,
                    LapDistancePercentage = telemetryInfo.LapDistPct.Value,
                    Incidents = telemetryInfo.PlayerCarTeamIncidentCount.Value
                }
            };
            if (Sim.Instance.Driver?.CurrentResults != null)
            {
                realTimeTelemetry.TimingTelemetry.DriverCurrentLap = telemetryInfo.Lap.Value;
                realTimeTelemetry.TimingTelemetry.DriverLapsComplete = Sim.Instance.Driver.CurrentResults.LapsComplete;
                //realTimeTelemetry.TimingTelemetry.DriverLapsRemaining = trackEvent.CurrentSession.IsRace ? (trackEvent.CurrentSession.IsFixedLaps ? Convert.ToInt32(trackEvent.CurrentSession.RaceLaps) - telemetryInfo.Lap.Value : realTimeSessionDataTask.SessionTiming.EstimatedWholeRaceLaps - telemetryInfo.Lap.Value) : Convert.ToInt32(Math.Ceiling(telemetryInfo.SessionTimeRemain.Value / Sim.Instance.Driver.CurrentResults.FastestTime.Time.TotalSeconds));
            }

            var telemetry = new PitBox.Core.SessionData.Telemetry()
            {
                CarTelemetry = new PitBox.Core.SessionData.CarTelemetry()
                {
                    Brake = realTimeTelemetry.CarTelemetry.Brake,
                    Clutch = realTimeTelemetry.CarTelemetry.Clutch,
                    CurrentLapTime = realTimeTelemetry.CarTelemetry.CurrentLapTime,
                    FuelConsumedLap = Convert.ToDecimal(realTimeTelemetry.CarTelemetry.FuelConsumedLap),
                    FuelPercent = Convert.ToDecimal(realTimeTelemetry.CarTelemetry.FuelPercent),
                    FuelPressure = realTimeTelemetry.CarTelemetry.FuelPressure,
                    FuelQuantity = realTimeTelemetry.CarTelemetry.FuelQuantity,
                    OilPressure = realTimeTelemetry.CarTelemetry.OilPressure,
                    OilTemp = realTimeTelemetry.CarTelemetry.OilTemp,
                    RPM = realTimeTelemetry.CarTelemetry.RPM,
                    Speed = realTimeTelemetry.CarTelemetry.Speed,
                    SteeringAngle = realTimeTelemetry.CarTelemetry.SteeringAngle,
                    Throttle = realTimeTelemetry.CarTelemetry.Throttle,
                    Voltage = realTimeTelemetry.CarTelemetry.Voltage,
                    WaterTemp = realTimeTelemetry.CarTelemetry.WaterTemp
                },
                TimingTelemetry = new PitBox.Core.SessionData.TimingTelemetry()
                {
                    CurrentLapTime = realTimeTelemetry.TimingTelemetry.CurrentLapTime,
                    DriverCurrentLap = realTimeTelemetry.TimingTelemetry.DriverCurrentLap,
                    DriverLapsComplete = realTimeTelemetry.TimingTelemetry.DriverLapsComplete,
                    Incidents = realTimeTelemetry.TimingTelemetry.Incidents,
                    LapDeltaToSessionBestLap = realTimeTelemetry.TimingTelemetry.LapDeltaToSessionBestLap,
                    LapDistancePercentage = realTimeTelemetry.TimingTelemetry.LapDistancePercentage
                }
            };

            var message = new PitBoxMessage<PitBox.Core.SessionData.Telemetry>()
            {
                Data = telemetry,
                SessionElapsedTime = PitBoxEngine.LastUpdateTime,
                SessionId = PitBoxEngine.PitBoxSessionId
            };

            return message;
        }
    }
}
