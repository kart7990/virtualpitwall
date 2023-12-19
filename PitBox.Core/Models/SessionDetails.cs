using PitBox.Core.SessionData;
using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.Models
{
    public class SessionDetails
    {

        public SessionDetails()
        {
        }

        public PitBoxSession Session { get; set; }
        public Dictionary<HubEndpoint, string> WebSocketEndpoints { get; set; }
    }
}
