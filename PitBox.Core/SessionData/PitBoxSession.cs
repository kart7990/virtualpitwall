using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class PitBoxSession
    {
        public string Id { get; set; }
        public string TeamId { get; set; }
        public Guid CreatorUserId { get; set; }
        public EventDetails EventDetails { get; set; }
    }
}
