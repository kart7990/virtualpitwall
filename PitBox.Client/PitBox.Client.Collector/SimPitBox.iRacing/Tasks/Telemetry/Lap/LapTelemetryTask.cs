using iRacingSdkWrapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimPitBox.Core.Models;

namespace SimPitBox.iRacing.Tasks.Telemetry.Lap
{
    public class LapTelemetryTask : PitBoxTask, ITelemetryTask
    {
        private readonly Event trackEvent;
        private readonly LapDetectionTask lapDetectionTask;
        private TelemetryInfo telemetryInfo;

        public LapTelemetry CurrentLapTelemetry { get; private set; }

        public event EventHandler<LapTelemetry> LapComplete;
        public bool TelemetryUpdateRequiresActiveSession => true;
        public bool RequiresCarOnTrack => true;

        public LapTelemetryTask(Event trackEvent, LapDetectionTask lapDetectionTask)
        {
            this.trackEvent = trackEvent;
            this.lapDetectionTask = lapDetectionTask;
            Start();
        }
        public void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            this.telemetryInfo = telemetryInfo;

            if (CurrentLapTelemetry != null)
            {
                //Speed min/max
                if (telemetryInfo.Speed.Value > CurrentLapTelemetry.MaxSpeed)
                {
                    CurrentLapTelemetry.MaxSpeed = telemetryInfo.Speed.Value;
                }
                if (telemetryInfo.Speed.Value < CurrentLapTelemetry.MinSpeed)
                {
                    CurrentLapTelemetry.MinSpeed = telemetryInfo.Speed.Value;
                }

                //RPM min/max
                if (telemetryInfo.RPM.Value > CurrentLapTelemetry.MaxRpm)
                {
                    CurrentLapTelemetry.MaxRpm = telemetryInfo.RPM.Value;
                }

                if (telemetryInfo.RPM.Value < CurrentLapTelemetry.MinRpm)
                {
                    CurrentLapTelemetry.MinRpm = telemetryInfo.RPM.Value;
                }

                //Pit Lane Check
                if (!CurrentLapTelemetry.InPitLane && telemetryInfo.CarIdxOnPitRoad.Value[telemetryInfo.PlayerCarIdx.Value])
                {
                    CurrentLapTelemetry.InPitLane = true;
                }
            }
        }

        private void LapDetectionTask_LapComplete(object sender, Core.Models.Lap e)
        {
            CurrentLapTelemetry.FuelLapEnd = telemetryInfo.FuelLevel.Value;
            CurrentLapTelemetry.RaceTimeRemaining = telemetryInfo.SessionTimeRemain.Value;
            CurrentLapTelemetry.IncidentCountLapEnd = telemetryInfo.PlayerCarMyIncidentCount.Value;
            trackEvent.CurrentSession.PlayerLapTelemetry.Add(CurrentLapTelemetry);
            OnLapComplete(CurrentLapTelemetry);
        }

        private void LapDetectionTask_LapStart(object sender, Core.Models.Lap e)
        {
            CurrentLapTelemetry = new LapTelemetry()
            {
                LapNumber = e.LapNumber,
                SessionNumber = trackEvent.CurrentSession.SessionNumber
            };

            if (HasTelemetry)
            {
                CurrentLapTelemetry.FuelLapStart = telemetryInfo.FuelLevel.Value;
                CurrentLapTelemetry.IncidentCountLapStart = telemetryInfo.PlayerCarMyIncidentCount.Value;
                CurrentLapTelemetry.MinRpm = telemetryInfo.RPM.Value;
                CurrentLapTelemetry.MinSpeed = telemetryInfo.Speed.Value;
            }
        }

        private bool HasTelemetry { get => telemetryInfo != null; }

        protected virtual void OnLapComplete(LapTelemetry e)
        {
            Log("Lap Telemetry Complete", JsonConvert.SerializeObject(e));
            LapComplete?.Invoke(this, e);
        }

        public void Start()
        {
            lapDetectionTask.LapStart += LapDetectionTask_LapStart;
            lapDetectionTask.LapComplete += LapDetectionTask_LapComplete;
        }
    }
}
