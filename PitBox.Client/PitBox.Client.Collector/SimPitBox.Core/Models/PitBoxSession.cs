using System;
using System.Collections.Generic;
using System.Text;

namespace SimPitBox.Core.Models
{
    public class PitBoxSession
    {
        public string Id { get; set; }
        public List<PitBoxDataProvider> PitBoxTimingProviders { get; } = new List<PitBoxDataProvider>();
        public List<PitBoxDataProvider> PitBoxTelemetryProviders { get; } = new List<PitBoxDataProvider>();
        public bool IsSessionDataLive { get; set; }
        public Event Event { get; set; }
    }
}
