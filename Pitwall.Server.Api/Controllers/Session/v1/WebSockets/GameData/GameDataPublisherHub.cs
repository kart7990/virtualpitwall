using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Session.Cache.GameData;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData
{
    public class GameDataPublisherHub : Hub<IGameDataPublisherCallbacks>
    {
        public const string VERSION = "/v1.0";
        public const string PATH = VERSION + "/pitwall/gamedatapublisher";
        private readonly IPitwallUser pitwallUser;
        private readonly IHubContext<GameDataSubscriberHub, IGameDataSubscriberCallbacks> gameDataSubscriberContext;
        private readonly GameDataProviderRepo gameDataProviderRepo;
        private readonly CompletedLapsRepo completedLapsRepo;
        private readonly ConditionsRepo conditionsRepo;
        private readonly TrackSessionRepo trackSessionRepo;
        private readonly GameSessionRepo gameSessionRepo;
        private readonly StandingsRepo standingsRepo;

        public GameDataPublisherHub(IPitwallUser pitwallUser, IHubContext<GameDataSubscriberHub, IGameDataSubscriberCallbacks> gameDataSubscriberContext,
            GameDataProviderRepo gameDataProviderRepo, CompletedLapsRepo completedLapsRepo, ConditionsRepo conditionsRepo, TrackSessionRepo trackSessionRepo,
            GameSessionRepo gameSessionRepo, StandingsRepo standingsRepo)
        {
            this.pitwallUser = pitwallUser;
            this.gameDataSubscriberContext = gameDataSubscriberContext;
            this.gameDataProviderRepo = gameDataProviderRepo;
            this.completedLapsRepo = completedLapsRepo;
            this.conditionsRepo = conditionsRepo;
            this.trackSessionRepo = trackSessionRepo;
            this.gameSessionRepo = gameSessionRepo;
            this.standingsRepo = standingsRepo;
        }

        public async Task AddGameSession(PitwallProviderMessage<BaseGameSession> gameSession)
        {
            await gameSessionRepo.Add(gameSession.ProviderId, gameSession.Data);
            var gameDataProvider = await gameDataProviderRepo.Get(gameSession.SessionId, gameSession.ProviderId);
            gameDataProvider.CurrentGameAssignedSessionId = gameSession.GameAssignedSessionId;
            await gameDataProviderRepo.Add(gameSession.SessionId, gameDataProvider);
            await gameDataSubscriberContext.Clients.Group(gameSession.SessionId + gameSession.ProviderId).NewGameSession(gameSession.Data);
        }

        public async Task AddLaps(PitwallProviderMessage<List<CompletedLap>> lapsMessage)
        {
            await completedLapsRepo.Add(lapsMessage.ProviderId, lapsMessage.GameAssignedSessionId, lapsMessage.SessionNumber, lapsMessage.SessionElapsedTime, lapsMessage.Data);
            await Clients.Caller.LapsReceived();
            await gameDataSubscriberContext.Clients.Group(lapsMessage.SessionId + lapsMessage.ProviderId).NewLapsAvailable();
        }

        public async Task TrackSessionChange(PitwallProviderMessage<BaseTrackSession> trackSession)
        {
            var gameSession = await gameSessionRepo.GetBase(trackSession.ProviderId, trackSession.GameAssignedSessionId);
            gameSession.CurrentTrackSession = trackSession.Data.Number;
            await gameSessionRepo.Update(trackSession.ProviderId, gameSession);

            await trackSessionRepo.Add(trackSession.ProviderId, trackSession.GameAssignedSessionId, trackSession.Data);
            await gameDataSubscriberContext.Clients.Group(trackSession.SessionId + trackSession.ProviderId).TrackSessionChanged(trackSession.Data);
            await Clients.Caller.TrackSessionChanged();
        }

        public async Task UpdateTrackSession(PitwallProviderMessage<DynamicTrackSessionData> dynamicGameData)
        {
            var trackSession = await trackSessionRepo.GetBase(dynamicGameData.ProviderId, dynamicGameData.GameAssignedSessionId, dynamicGameData.SessionNumber);

            trackSession.LeaderLapsRemaining = dynamicGameData.Data.LeaderLapsRemaining;
            trackSession.EstimatedRaceLaps = dynamicGameData.Data.EstimatedRaceLaps;
            trackSession.LapsRemaining = dynamicGameData.Data.LapsRemaining;
            trackSession.LeaderWholeLapsRemaining = dynamicGameData.Data.LeaderWholeLapsRemaining;
            trackSession.EstimatedWholeRaceLaps = dynamicGameData.Data.EstimatedWholeRaceLaps;
            trackSession.GameDateTime = dynamicGameData.Data.GameDateTime;
            trackSession.RaceTimeRemaining = dynamicGameData.Data.RaceTimeRemaining;
            trackSession.Flags = dynamicGameData.Data.Flags;
            trackSession.ServerTime = dynamicGameData.Data.ServerTime;
            trackSession.State = dynamicGameData.Data.SessionState;

            await trackSessionRepo.Update(dynamicGameData.ProviderId, dynamicGameData.GameAssignedSessionId, trackSession);

            await conditionsRepo.Set(dynamicGameData.ProviderId, dynamicGameData.GameAssignedSessionId, dynamicGameData.SessionNumber, dynamicGameData.Data.Conditions);

            await Clients.Caller.GameDataReceived();
        }

        public async Task UpdateStandings(PitwallMessage<List<Standing>> standings)
        {
            await standingsRepo.Set(standings.ProviderId, standings.Data);
            await Clients.Caller.StandingsReceived();
        }

        public override async Task OnConnectedAsync()
        {
            var sessionId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "sessionId").Value;
            var gameDataProviderId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "dataProviderId").Value;
            var provider = await gameDataProviderRepo.Get(sessionId, gameDataProviderId);

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

        private List<CompletedLap> MapLaps(List<Lap> laps)
        {
            var completedLaps = new List<CompletedLap>();

            foreach (var lap in laps)
            {
                CompletedLap completedLap = new CompletedLap()
                {
                    CarNumber = lap.CarNumber,
                    ClassPosition = lap.ClassPosition,
                    ConditionsIdLapEnd = "",
                    ConditionsIdLapStart = "",
                    DriverCustId = lap.DriverCustId,
                    DriverName = lap.DriverName,
                    GameDateTimeLapStart = 0,
                    InPitLane = lap.InPitLane,
                    LapNumber = lap.LapNumber,
                    LapTime = lap.LapTime,
                    PitStopCount = lap.PitStopCount,
                    Position = lap.Position,
                    RaceTimeRemaining = lap.RaceTimeRemaining,
                    SessionTimeLapEnd = lap.SessionTimeLapEnd,
                    SessionTimeLapStart = lap.SessionTimeLapStart,
                    Stint = lap.Stint,
                    TrackSessionNumber = lap.SessionNumber
                };
                completedLaps.Add(completedLap);
            }

            return completedLaps;
        }
    }
}
