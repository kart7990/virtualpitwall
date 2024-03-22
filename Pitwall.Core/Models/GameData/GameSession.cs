using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class GameSession : BaseGameSession
    {
        public List<TrackSession> TrackSessions { get; set; }
    }

    public class BaseGameSession
    {
        public string Id { get; set; }
        public string GameAssignedSessionId { get; set; }
        public string Type { get; set; }
        public int CurrentTrackSession { get; set; }
    }
}
