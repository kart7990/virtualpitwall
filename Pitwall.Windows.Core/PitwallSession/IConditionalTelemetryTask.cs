using iRacingSdkWrapper;

namespace Pitwall.Windows.Core.PitwallSession
{
    internal interface IConditionalTelemetryTask
    {
        bool TelemetryUpdateRequiresActiveSession { get; }
        bool RequiresCarOnTrack { get; }
        void OnTelemetryUpdate(TelemetryInfo telemetryInfo);
    }
}
