namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData
{
    public interface IGameDataPublisherCallbacks
    {
        Task SessionDataReceived();
        Task LapsReceived();
        Task GameDataReceived();
        Task TrackSessionChanged();
        Task StandingsReceived();
    }
}
