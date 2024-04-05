using Pitwall.Core.Models;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Session.Cache;
using Pitwall.Server.Core.Session.Cache.GameData;
using Pitwall.Server.Core.Session.Cache.Telemetry;

namespace Pitwall.Server.Core.Session
{
    public class SessionService(IPitwallUser user, PitwallSessionRepo pitwallSessionRepo,
        TelemetryProviderRepo telemetryProviderRepo, CompletedLapTelemetryRepo completedLapTelemetryRepo,
        GameDataProviderRepo gameDataProviderRepo, GameSessionRepo gameSessionRepo)
    {
        public async Task<PitwallSession> CreateSession()
        {
            var pitwallSession = new PitwallSession() { Id = Guid.NewGuid().ToString(), CreatorUserId = user.Id };

            await pitwallSessionRepo.Add(pitwallSession);

            return pitwallSession;
        }

        public async Task<PitwallSession> GetSession(Guid pitwallSessionId)
        {
            return await pitwallSessionRepo.Get(pitwallSessionId.ToString());
        }

        public async Task<BaseTelemetryProvider> CreateTelemetryProvider(Guid pitwallSessionId)
        {
            var pitwallSession = await pitwallSessionRepo.Get(pitwallSessionId.ToString());

            if (pitwallSession == null)
            {
                return null;
            }

            var telemetryProvider = new BaseTelemetryProvider()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id.ToString(),
                Name = user.Name,
                PitwallSessionId = pitwallSessionId.ToString()
            };
            await telemetryProviderRepo.Add(pitwallSessionId.ToString(), telemetryProvider);
            return telemetryProvider;
        }

        public async Task<CompletedTelemetryLaps> GetCompletedTelemetryLaps(Guid pitwallSessionId, Guid dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var pitwallSession = await pitwallSessionRepo.Get(pitwallSessionId.ToString());

            if (pitwallSession == null)
            {
                return null;
            }

            return await completedLapTelemetryRepo.GetRange(dataProviderId.ToString(), gameAssignedSessionId, trackSessionNumber, 0);
        }

        public async Task<BaseGameDataProvider> CreateGameDataProvider(Guid pitwallSessionId)
        {
            var pitwallSession = await pitwallSessionRepo.Get(pitwallSessionId.ToString());

            if (pitwallSession == null)
            {
                return null;
            }

            var gameDataProvider = new GameDataProvider()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id.ToString(),
                Name = user.Name,
                PitwallSessionId = pitwallSessionId.ToString()
            };
            await gameDataProviderRepo.Add(pitwallSessionId.ToString(), gameDataProvider);

            return gameDataProvider;
        }

        public async Task<GameSession> GetGameSession(Guid pitwallSessionId, Guid dataProviderId, string gameAssignedSessionId)
        {
            var pitwallSession = await pitwallSessionRepo.Get(pitwallSessionId.ToString());

            if (pitwallSession == null)
            {
                return null;
            }

            return await gameSessionRepo.Get(dataProviderId.ToString(), gameAssignedSessionId);
        }
    }
}
