using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Server.Api.Controllers.Auth;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Session;
using Pitwall.Server.Core.Session.Cache;
using Pitwall.Server.Core.Session.Cache.GameData;
using Pitwall.Server.Core.Session.Cache.Telemetry;

namespace Pitwall.Server.Api.Controllers.Session.v1
{

    [Produces("application/json")]
    [ApiVersion(1.0)]
    [ApiController]
    [Route("v{version:apiVersion}/pitwall/session")]
    public class SessionsController(SessionService sessionService, IPitwallUser user,
            IHubContext<PitwallSessionHub, IPitwallSessionCallbacks> sessionHub,
            PitwallSessionRepo pitwallSessionRepo,
            GameDataProviderRepo gameDataProviderRepo,
            TelemetryProviderRepo telemetryProviderRepo,
            CompletedLapTelemetryRepo completedLapTelemetryRepo,
            GameSessionRepo gameSessionRepo) : AuthorizedController
    {


        [HttpPost]
        [ProducesResponseType(typeof(PitwallSession), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateSession()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pitwallSession = await sessionService.CreateSession();
            return Created("", pitwallSession);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PitwallSessionResponse), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Get(Guid id)
        {
            var session = await pitwallSessionRepo.Get(id.ToString());

            if (session != null)
            {
                var pitwallSessionResponse = new PitwallSessionResponse()
                {
                    PitwallSession = session,
                    WebSocketEndpoints = ConnectionDetails.Endpoints
                };
                return Ok(pitwallSessionResponse);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("{id}/telemetry/providers", Name = "CreateTelemetryProvider")]
        [ProducesResponseType(typeof(BaseTelemetryProvider), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> CreateTelemetryProvider(Guid id)
        {
            var pitwallSession = await pitwallSessionRepo.Get(id.ToString());

            if (pitwallSession == null)
            {
                return NotFound();
            }

            var telemetryProvider = new BaseTelemetryProvider()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id.ToString(),
                Name = user.Name,
                PitwallSessionId = id.ToString()
            };
            await telemetryProviderRepo.Add(id.ToString(), telemetryProvider);
            await sessionHub.Clients.Group(id.ToString()).TelemetryProviderConnected(telemetryProvider);
            return Ok(telemetryProvider);
        }

        [HttpGet("{id}/telemetry/{dataProviderId}/gamesessionid/{gameAssignedSessionId}/{trackSessionNumber}", Name = "GetTelemetryData")]
        [ProducesResponseType(typeof(CompletedTelemetryLaps), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetTelemetryData(Guid id, Guid dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var session = await pitwallSessionRepo.Get(id.ToString());

            if (session != null)
            {
                var completedTelemetryLaps = await completedLapTelemetryRepo.GetRange(dataProviderId.ToString(), gameAssignedSessionId, trackSessionNumber, 0);
                return Ok(completedTelemetryLaps);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("{id}/gamedata/providers", Name = "CreateGameDataProvider")]
        [ProducesResponseType(typeof(GameDataProvider), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> CreateGameDataProvider(Guid id)
        {
            var pitwallSession = await pitwallSessionRepo.Get(id.ToString());

            if (pitwallSession == null)
            {
                return NotFound();
            }

            var gameDataProvider = new GameDataProvider()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id.ToString(),
                Name = user.Name,
                PitwallSessionId = id.ToString()
            };
            await gameDataProviderRepo.Add(id.ToString(), gameDataProvider);
            await sessionHub.Clients.Group(id.ToString()).GameDataProviderConnected(gameDataProvider);
            return Ok(gameDataProvider);
        }

        [HttpGet("{id}/gamedata/{dataProviderId}/gamesessionid/{gameAssignedSessionId}", Name = "GetGameData")]
        [ProducesResponseType(typeof(GameSession), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetGameData(Guid id, Guid dataProviderId, string gameAssignedSessionId)
        {
            var session = await pitwallSessionRepo.Get(id.ToString());

            if (session != null)
            {
                var gameSession = await BuildGameSession(dataProviderId, gameAssignedSessionId);
                return Ok(gameSession);
            }
            else
            {
                return NotFound();
            }
        }

        private async Task<GameSession> BuildGameSession(Guid dataProviderId, string gameAssignedSessionId)
        {
            var gameData = await gameSessionRepo.Get(dataProviderId.ToString(), gameAssignedSessionId);
            return gameData;
        }
    }
}
