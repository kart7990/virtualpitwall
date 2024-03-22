using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class GameDataProvider : BaseGameDataProvider
    {
        public List<GameSession> GameSessions { get; set; }
    }

    public class BaseGameDataProvider
    {
        public string Id { get; set; }
        public string PitwallSessionId { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string CurrentGameAssignedSessionId { get; set; }
        public List<string> GameAssignedSessionIds { get; set; }
    }
}
