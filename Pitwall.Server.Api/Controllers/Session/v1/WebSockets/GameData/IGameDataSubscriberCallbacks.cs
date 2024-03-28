using Pitwall.Core.Models.GameData;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData
{
    public interface IGameDataSubscriberCallbacks
    {
        Task NewLapsAvailable();
        Task NewGameSession(BaseGameSession baseGameSession);
        Task TrackSessionChanged(BaseTrackSession baseTrackSession);
        Task NewLapsResponse(CompletedLaps completedLaps);
        Task DynamicTrackSessionDataUpdate(DynamicTrackSessionData dynamicTrackSessionData);
        Task StandingsUpdate(List<Standing> standings);
    }
}
