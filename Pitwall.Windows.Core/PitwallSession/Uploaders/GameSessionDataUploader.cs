using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Windows.Core.Session;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    internal class GameSessionDataUploader
    {
        private readonly string pitwallSessionId;
        private readonly DataPublisherConnection publisherConnection;

        public GameSessionDataUploader(GameSessionManager gameSessionManager, string pitwallSessionId, DataPublisherConnection publisherConnection)
        {
            this.pitwallSessionId = pitwallSessionId;
            this.publisherConnection = publisherConnection;
            gameSessionManager.NewGameSession += SessionsTask_NewEvent;
            gameSessionManager.NewTrackSession += SessionsTask_NewSession;
            gameSessionManager.TrackSessionUpdate += SessionsTask_SessionUpdate;
        }

        private async void SessionsTask_NewEvent(object sender, Models.GameSession e)
        {
            await publisherConnection.Connection.SendAsync("AddGameSession", new PitwallProviderMessage<BaseGameSession>()
            {
                ProviderId = publisherConnection.ProviderId,
                SessionId = pitwallSessionId,
                GameAssignedSessionId = e.SubSessionId.ToString(),
                Data = new BaseGameSession()
                {
                    CurrentTrackSession = e.CurrentSession.SessionNumber,
                    GameAssignedSessionId = e.SubSessionId.ToString(),
                    Id = Guid.NewGuid().ToString(),
                    Type = e.GameSessionType
                }
            });
            await NewSession(e.CurrentSession);
            //TrackSessionChange
        }

        private async void SessionsTask_SessionUpdate(object sender, Models.TrackSession e)
        {

        }

        private async void SessionsTask_NewSession(object sender, Models.TrackSession e)
        {
            await NewSession(e);
        }

        private async Task NewSession(Models.TrackSession e)
        {
            var trackSession = new BaseTrackSession()
            {
                Flags = e.Flags,
                IsMulticlass = e.IsMulticlass,
                RaceLaps = e.RaceLaps,
                RaceTime = e.RaceTime,
                Name = e.SessionName,
                Number = e.SessionNumber,
                Type = e.SessionType,
                Track = new Track()
                {
                    CodeName = e.Track.CodeName,
                    Id = e.Track.Id,
                    Length = e.Track.Length,
                    Name = e.Track.Name,
                    Sectors = e.Track.Sectors.Select(s => new Sector()
                    {
                        Number = s.Number,
                        StartPercentage = s.StartPercentage
                    }).ToList(),
                },
                IsActive = true,
                EstimatedRaceLaps = -1,
                EstimatedWholeRaceLaps = -1,
                GameDateTime = -1,
                LapsRemaining = -1,
                LeaderLapsRemaining = -1,
                LeaderWholeLapsRemaining = -1,
                RaceTimeRemaining = -1,
                ServerTime = -1,
                State = ""
            };

            var message = new PitwallProviderMessage<BaseTrackSession>()
            {
                GameAssignedSessionId = e.SubSessionId.ToString(),
                ProviderId = publisherConnection.ProviderId,
                SessionNumber = e.SessionNumber,
                SessionId = PitwallDataEngine.PitwallSesisonId,
                TeamId = "",
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                Data = trackSession
            };

            var json = JsonConvert.SerializeObject(message);
            await publisherConnection.Connection.SendAsync("TrackSessionChange", message);
        }
    }
}
