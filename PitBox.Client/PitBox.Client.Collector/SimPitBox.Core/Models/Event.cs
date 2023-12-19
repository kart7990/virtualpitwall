using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace SimPitBox.Core.Models
{
    public class Event
    {
        public string EventType { get; set; }
        public int SubSessionId { get; set; }
        public List<Session> Sessions { get; } = new List<Session>();
        public int CurrentSessionNumber { get; set; } = -1;
        public bool IsSessionActive { get { return CurrentSession != null && !CurrentSession.IsFinished; } }
        [JsonIgnore]
        public Session CurrentSession { get { return Sessions.SingleOrDefault(s => s.SessionNumber == CurrentSessionNumber); } }

        public void Reset(Session session)
        {
            Sessions.Clear();
            Sessions.Add(session);
            SubSessionId = session.SubSessionId;
        }
    }
}
