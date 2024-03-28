namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry
{
    public interface ITelemetryPublisherCallbacks
    {
        Task CompletedLapTelemetryDeleted();
        Task TelemetryProviderUpdated();
        Task TelemetryUpdated();
        Task TelemetryLapAdded();
    }
}
