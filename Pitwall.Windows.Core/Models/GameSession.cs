using Newtonsoft.Json;

namespace Pitwall.Windows.Core.Models
{
    public class GameSession
    {
        public string GameSessionType { get; set; }
        public int SubSessionId { get; set; } = -1;
        public Driver Player { get; set; }
        public List<TrackSession> Sessions { get; } = new List<TrackSession>();
        public int CurrentSessionNumber { get; set; } = -1;
        public bool IsSessionActive { get { return CurrentSession != null && !CurrentSession.IsFinished; } }
        [JsonIgnore]
        public TrackSession CurrentSession { get { return Sessions.SingleOrDefault(s => s.SessionNumber == CurrentSessionNumber); } }

        public void Reset(TrackSession session)
        {
            Sessions.Clear();
            Sessions.Add(session);
            SubSessionId = session.SubSessionId;
        }
    }
}
