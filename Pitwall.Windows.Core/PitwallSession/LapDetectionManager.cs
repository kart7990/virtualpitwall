using iRacingSdkWrapper;

namespace Pitwall.Windows.Core.PitwallSession
{
    internal class LapDetectionManager : IConditionalTelemetryTask
    {
        public Models.Lap CurrentLap { get; private set; } = null;

        public event EventHandler<Models.Lap> LapStart;
        public event EventHandler<Models.Lap> LapComplete;

        public bool TelemetryUpdateRequiresActiveSession => true;
        public bool RequiresCarOnTrack => true;

        public void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            //initial lap
            if (CurrentLap == null)
            {
                OnLapStart(telemetryInfo.Lap.Value);
            }
            else if (telemetryInfo.Lap.Value > CurrentLap.LapNumber)
            {
                //lap complete
                OnLapComplete(CurrentLap);
                //lap start
                OnLapStart(telemetryInfo.Lap.Value);
            }
        }

        protected virtual void OnLapStart(int number)
        {
            CurrentLap = new Models.Lap() { LapNumber = number };
            //Log("Lap Start", number.ToString());
            LapStart?.Invoke(this, CurrentLap);
        }

        protected virtual void OnLapComplete(Core.Models.Lap e)
        {
            //Log("Lap Complete", e.LapNumber.ToString());
            LapComplete?.Invoke(this, e);
        }
    }
}
