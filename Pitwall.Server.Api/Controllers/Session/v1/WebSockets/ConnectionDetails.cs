using Pitwall.Core.Models;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets
{
    public class ConnectionDetails
    {
        public static Dictionary<HubEndpoint, string> Endpoints => new Dictionary<HubEndpoint, string>()
        {
            { HubEndpoint.v1PitwallSession, PitwallSessionHub.PATH },
            { HubEndpoint.v1GameDataPublisher, GameDataPublisherHub.PATH },
            { HubEndpoint.v1GameDataSubscriber, GameDataSubscriberHub.PATH },
            { HubEndpoint.v1TelemetryPublisher, TelemetryPublisherHub.PATH },
            { HubEndpoint.v1TelemetrySubscriber, TelemetrySubscriberHub.PATH }
        };
    }
}
