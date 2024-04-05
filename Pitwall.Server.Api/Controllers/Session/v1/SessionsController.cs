using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Pitwall.Core.Models;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Server.Api.Controllers.Auth;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets;
using Pitwall.Server.Core.Session;

namespace Pitwall.Server.Api.Controllers.Session.v1
{

    [Produces("application/json")]
    [ApiVersion(1.0)]
    [ApiController]
    [Route("v{version:apiVersion}/pitwall/session")]
    public class SessionsController(SessionService sessionService, IHubContext<PitwallSessionHub, IPitwallSessionCallbacks> sessionHub) : AuthorizedController
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
            var pitwallSession = await sessionService.GetSession(id);

            if (pitwallSession != null)
            {
                var pitwallSessionResponse = new PitwallSessionResponse()
                {
                    PitwallSession = pitwallSession,
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
            var telemetryProvider = await sessionService.CreateTelemetryProvider(id);

            if (telemetryProvider != null)
            {
                await sessionHub.Clients.Group(id.ToString()).TelemetryProviderConnected(telemetryProvider);

                return Ok(telemetryProvider);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet("{id}/telemetry/{dataProviderId}/gamesessionid/{gameAssignedSessionId}/{trackSessionNumber}", Name = "GetTelemetryData")]
        [ProducesResponseType(typeof(CompletedTelemetryLaps), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetTelemetryData(Guid id, Guid dataProviderId, string gameAssignedSessionId, int trackSessionNumber)
        {
            var completedTelemetryLaps = await sessionService.GetCompletedTelemetryLaps(id, dataProviderId, gameAssignedSessionId, trackSessionNumber);

            if (completedTelemetryLaps != null)
            {
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
            var gameDataProvider = await sessionService.CreateGameDataProvider(id);

            if (gameDataProvider != null)
            {
                await sessionHub.Clients.Group(id.ToString()).GameDataProviderConnected(gameDataProvider);
                return Ok(gameDataProvider);
            }
            else
            {

                return NotFound();
            }
        }

        [HttpGet("{id}/gamedata/{dataProviderId}/gamesessionid/{gameAssignedSessionId}", Name = "GetGameData")]
        [ProducesResponseType(typeof(GameSession), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetGameData(Guid id, Guid dataProviderId, string gameAssignedSessionId)
        {
            var gameSession = await sessionService.GetGameSession(id, dataProviderId, gameAssignedSessionId);

            if (gameSession != null)
            {
                return Ok(gameSession);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
