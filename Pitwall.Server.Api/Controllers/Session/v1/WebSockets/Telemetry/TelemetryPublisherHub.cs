using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Session.Cache.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry
{
    public class TelemetryPublisherHub : Hub<ITelemetryPublisherCallbacks>
    {
        public const string VERSION = "/v1.0";
        public const string PATH = VERSION + "/pitwall/telemetrypublisher";
        private readonly IPitwallUser pitwallUser;
        private readonly TelemetryRepo telemetryRepo;
        private readonly CompletedLapTelemetryRepo completedLapTelemetryRepo;
        private readonly TelemetryProviderRepo telemetryProviderRepo;
        private readonly IHubContext<TelemetrySubscriberHub, ITelemetrySubscriberCallbacks> telemetrySubscriberContext;

        public TelemetryPublisherHub(IPitwallUser pitwallUser, TelemetryRepo telemetryRepo, CompletedLapTelemetryRepo completedLapTelemetryRepo,
            TelemetryProviderRepo telemetryProviderRepo, IHubContext<TelemetrySubscriberHub, ITelemetrySubscriberCallbacks> telemetrySubscriberContext)
        {
            this.pitwallUser = pitwallUser;
            this.telemetryRepo = telemetryRepo;
            this.completedLapTelemetryRepo = completedLapTelemetryRepo;
            this.telemetryProviderRepo = telemetryProviderRepo;
            this.telemetrySubscriberContext = telemetrySubscriberContext;
        }

        public async Task UpdateTelemetry(PitwallMessage<Pitwall.Core.Models.Telemetry.Telemetry> pitwallMessage)
        {
            await telemetryRepo.Set(pitwallMessage.ProviderId, pitwallMessage.Data);
            await Clients.Caller.TelemetryUpdated();
        }

        public async Task UpdateTelemetryProvider(PitwallMessage<BaseTelemetryProvider> pitwallMessage)
        {
            await telemetryProviderRepo.UpdateTelemetryProvider(pitwallMessage.SessionId, pitwallMessage.ProviderId, pitwallMessage.Data);
            var provider = await telemetryProviderRepo.Get(pitwallMessage.SessionId, pitwallMessage.ProviderId);
            await Clients.Caller.TelemetryProviderUpdated();
            await telemetrySubscriberContext.Clients.Groups(pitwallMessage.SessionId + pitwallMessage.ProviderId).TelemetryProviderUpdate(provider);
        }

        public async Task AddTelemetryLap(PitwallMessage<CompletedLapDetails> lapsMessage)
        {
            await completedLapTelemetryRepo.Add(lapsMessage.ProviderId, lapsMessage.GameAssignedSessionId, lapsMessage.SessionNumber, lapsMessage.SessionElapsedTime, lapsMessage.Data);
            await Clients.Caller.TelemetryLapAdded();
            await telemetrySubscriberContext.Clients.Groups(lapsMessage.SessionId + lapsMessage.ProviderId).NewTelemetryLap();
        }

        //DO THIS ON TRACK SESSION CHANGE BACKWARD
        public async Task DeleteCompletedLapTelemetry(TimeBasedPitwallMessage pitwallMessage)
        {
            await completedLapTelemetryRepo.Delete(pitwallMessage.ProviderId, pitwallMessage.GameAssignedSessionId, pitwallMessage.SessionNumber);
            await Clients.Caller.CompletedLapTelemetryDeleted();
        }

        public override async Task OnConnectedAsync()
        {
            var sessionId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "sessionId").Value;
            var gameDataProviderId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "dataProviderId").Value;
            var provider = await telemetryProviderRepo.Get(sessionId, gameDataProviderId);

            //Provider needs to be registered via api call first, ensure access
            if (provider != null && provider.UserId == pitwallUser.Id.ToString())
            {
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
