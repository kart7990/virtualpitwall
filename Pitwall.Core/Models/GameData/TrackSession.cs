using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class TrackSession : BaseTrackSession
    {
        public Conditions CurrentConditions { get; set; }
        public CompletedLaps CompletedLaps { get; set; } = new CompletedLaps();
        public List<Conditions> ConditionHistory { get; set; } = new List<Conditions>();
    }
}
