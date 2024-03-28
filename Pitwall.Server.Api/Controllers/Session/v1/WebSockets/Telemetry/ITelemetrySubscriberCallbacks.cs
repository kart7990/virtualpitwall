using Pitwall.Core.Models.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry
{
    public interface ITelemetrySubscriberCallbacks
    {
        Task TelemetryUpdate(Pitwall.Core.Models.Telemetry.Telemetry telemetry);

        Task CompletedLapTelemetryUpdate(CompletedTelemetryLaps laps);

        Task NewTelemetryLap();

        Task TelemetryProviderUpdate(BaseTelemetryProvider telemetryProvider);
    }
}
