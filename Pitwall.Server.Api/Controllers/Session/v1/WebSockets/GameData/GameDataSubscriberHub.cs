using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Server.Core.Session.Cache.GameData;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData
{
    public class GameDataSubscriberHub : Hub<IGameDataSubscriberCallbacks>
    {
        public const string VERSION = "/v1.0";
        public const string PATH = VERSION + "/pitwall/gamedatasubscriber";

        private readonly GameDataProviderRepo gameDataProviderRepo;
        private readonly CompletedLapsRepo completedLapsRepo;
        private readonly TrackSessionRepo trackSessionRepo;
        private readonly ConditionsRepo conditionsRepo;
        private readonly StandingsRepo standingsRepo;

        public GameDataSubscriberHub(GameDataProviderRepo gameDataProviderRepo, CompletedLapsRepo completedLapsRepo, TrackSessionRepo trackSessionRepo, ConditionsRepo conditionsRepo, StandingsRepo standingsRepo)
        {
            this.gameDataProviderRepo = gameDataProviderRepo;
            this.completedLapsRepo = completedLapsRepo;
            this.trackSessionRepo = trackSessionRepo;
            this.conditionsRepo = conditionsRepo;
            this.standingsRepo = standingsRepo;
        }

        public async Task RequestLaps(TimeBasedPitwallMessage pitwallMessage)
        {
            var data = await completedLapsRepo.GetRange(pitwallMessage.ProviderId, pitwallMessage.GameAssignedSessionId, pitwallMessage.SessionNumber, pitwallMessage.SessionElapsedTime);
            await Clients.Caller.NewLapsResponse(data);
        }

        public async Task RequestDynamicTrackSessionData(TimeBasedPitwallMessage pitBoxMessage)
        {
            var dynamicData = new DynamicTrackSessionData();
            var trackSession = await trackSessionRepo.GetBase(pitBoxMessage.ProviderId, pitBoxMessage.GameAssignedSessionId, pitBoxMessage.SessionNumber);

            dynamicData.LeaderLapsRemaining = trackSession.LeaderLapsRemaining;
            dynamicData.EstimatedRaceLaps = trackSession.EstimatedRaceLaps;
            dynamicData.LapsRemaining = trackSession.LapsRemaining;
            dynamicData.LeaderWholeLapsRemaining = trackSession.LeaderWholeLapsRemaining;
            dynamicData.EstimatedWholeRaceLaps = trackSession.EstimatedWholeRaceLaps;
            dynamicData.GameDateTime = trackSession.GameDateTime;
            dynamicData.RaceTimeRemaining = trackSession.RaceTimeRemaining;
            dynamicData.Flags = trackSession.Flags;
            dynamicData.ServerTime = trackSession.ServerTime;
            dynamicData.SessionState = trackSession.State;

            var conditions = await conditionsRepo.Get(pitBoxMessage.ProviderId, pitBoxMessage.GameAssignedSessionId, pitBoxMessage.SessionNumber);
            dynamicData.Conditions = conditions;

            await Clients.Caller.DynamicTrackSessionDataUpdate(dynamicData);
        }

        public async Task RequestStandings(BasePitwallMessage pitwallMessage)
        {
            var data = await standingsRepo.Get(pitwallMessage.ProviderId);
            await Clients.Caller.StandingsUpdate(data);
        }

        public override async Task OnConnectedAsync()
        {
            var sessionId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "sessionId").Value;
            var gameDataProviderId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "dataProviderId").Value;
            var provider = await gameDataProviderRepo.Get(sessionId, gameDataProviderId);

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
