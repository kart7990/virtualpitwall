using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Server.Core.Session.Cache.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry
{
    public class TelemetrySubscriberHub : Hub<ITelemetrySubscriberCallbacks>
    {
        public const string VERSION = "/v1.0";
        public const string PATH = VERSION + "/pitwall/telemetrysubscriber";
        private readonly TelemetryRepo telemetryRepo;
        private readonly CompletedLapTelemetryRepo completedLapTelemetryRepo;
        private readonly TelemetryProviderRepo telemetryProviderRepo;

        public TelemetrySubscriberHub(TelemetryRepo telemetryRepo, CompletedLapTelemetryRepo completedLapTelemetryRepo, TelemetryProviderRepo telemetryProviderRepo)
        {
            this.telemetryRepo = telemetryRepo;
            this.completedLapTelemetryRepo = completedLapTelemetryRepo;
            this.telemetryProviderRepo = telemetryProviderRepo;
        }

        public async Task RequestTelemetry(BasePitwallMessage basePitwallMessage)
        {
            var data = await telemetryRepo.Get(basePitwallMessage.ProviderId);
            await Clients.Caller.TelemetryUpdate(data);
        }

        public async Task RequestTelemetryLaps(TimeBasedPitwallMessage pitwallMessage)
        {
            var data = await completedLapTelemetryRepo.GetRange(pitwallMessage.ProviderId, pitwallMessage.GameAssignedSessionId, pitwallMessage.SessionNumber, pitwallMessage.SessionElapsedTime);
            await Clients.Caller.CompletedLapTelemetryUpdate(data);
        }

        public override async Task OnConnectedAsync()
        {
            var sessionId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "sessionId").Value;
            var gameDataProviderId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "dataProviderId").Value;
            var provider = await telemetryProviderRepo.Get(sessionId, gameDataProviderId);

            if (provider != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, sessionId + gameDataProviderId);
                await base.OnConnectedAsync();
            }
            else
            {
                Context.Abort();
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

    }
}
