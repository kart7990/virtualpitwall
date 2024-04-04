using iRacingSdkWrapper;
using Pitwall.Windows.Core.Models;

namespace Pitwall.Windows.Core.PitwallSession
{
    internal class LapTelemetryManager : IConditionalTelemetryTask
    {
        private readonly GameSession gameSession;
        private TelemetryInfo telemetryInfo;

        public LapTelemetry CurrentLapTelemetry { get; private set; }

        public event EventHandler<LapTelemetry> LapComplete;
        public bool TelemetryUpdateRequiresActiveSession => true;
        public bool RequiresCarOnTrack => true;

        public LapTelemetryManager(GameSession gameSession, LapDetectionManager lapDetectionManager)
        {
            this.gameSession = gameSession;

            //TODO: DH - Memory leak?
            lapDetectionManager.LapStart += LapDetectionTask_LapStart;
            lapDetectionManager.LapComplete += LapDetectionTask_LapComplete;
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

        private void LapDetectionTask_LapComplete(object sender, Lap e)
        {
            CurrentLapTelemetry.FuelLapEnd = telemetryInfo.FuelLevel.Value;
            CurrentLapTelemetry.RaceTimeRemaining = telemetryInfo.SessionTimeRemain.Value;
            CurrentLapTelemetry.IncidentCountLapEnd = telemetryInfo.PlayerCarMyIncidentCount.Value;
            gameSession.CurrentSession.PlayerLapTelemetry.Add(CurrentLapTelemetry);
            OnLapComplete(CurrentLapTelemetry);
        }

        private void LapDetectionTask_LapStart(object sender, Lap e)
        {
            CurrentLapTelemetry = new LapTelemetry()
            {
                LapNumber = e.LapNumber,
                SessionNumber = gameSession.CurrentSession.SessionNumber,
                GameAssignedSessionId = gameSession.SubSessionId.ToString()
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
            //Log("Lap Telemetry Complete", JsonConvert.SerializeObject(e));
            LapComplete?.Invoke(this, e);
        }
    }
}
