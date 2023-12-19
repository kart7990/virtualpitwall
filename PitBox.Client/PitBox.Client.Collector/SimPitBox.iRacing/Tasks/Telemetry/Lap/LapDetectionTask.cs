using iRacingSdkWrapper;
using SimPitBox.iRacing.Tasks.Telemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimPitBox.Core.Models;

namespace SimPitBox.iRacing.Tasks.Telemetry.Lap
{
    /// <summary>
    /// Used for tracking lap start/complete for telemetry purposes.
    /// </summary>
    public class LapDetectionTask : PitBoxTask, ITelemetryTask
    {
        public Core.Models.Lap CurrentLap { get; private set; } = null;

        public event EventHandler<Core.Models.Lap> LapStart;
        public event EventHandler<Core.Models.Lap> LapComplete;

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
            CurrentLap = new Core.Models.Lap() { LapNumber = number };
            Log("Lap Start", number.ToString());
            LapStart?.Invoke(this, CurrentLap);
        }

        protected virtual void OnLapComplete(Core.Models.Lap e)
        {
            Log("Lap Complete", e.LapNumber.ToString());
            LapComplete?.Invoke(this, e);
        }
    }
}
