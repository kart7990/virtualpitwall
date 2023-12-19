using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class EventDetails
    {
        /// <summary>
        /// The iRacing Session ID if in an online session.
        /// </summary>
        public int SubSessionId { get; set; }
        public int CurrentTrackSessionNumber { get; set; }
        public string Type { get; set; }
        public List<TrackSession> TrackSessions { get; set; } = new List<TrackSession>();
    }
}
