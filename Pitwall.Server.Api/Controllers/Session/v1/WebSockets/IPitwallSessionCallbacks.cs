using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets
{
    public interface IPitwallSessionCallbacks
    {
        Task GameDataProviderConnected(BaseGameDataProvider gameDataProvider);
        Task GameDataProviderDisconnected(BaseGameDataProvider gameDataProvider);
        Task TelemetryProviderConnected(BaseTelemetryProvider telemetryProvider);
        Task TelemetryProviderDisconnected(BaseTelemetryProvider telemetryProvider);
    }
}
