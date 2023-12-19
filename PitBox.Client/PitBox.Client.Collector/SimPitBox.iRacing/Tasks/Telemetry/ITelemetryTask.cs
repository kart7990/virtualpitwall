using iRacingSdkWrapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks.Telemetry
{
    public interface ITelemetryTask
    {
        bool TelemetryUpdateRequiresActiveSession { get; }
        bool RequiresCarOnTrack { get; }
        void OnTelemetryUpdate(TelemetryInfo telemetryInfo);
    }
}
