using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class BaseTrackSession
    {
        public int Number { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string State { get; set; }
        public string RaceLaps { get; set; }
        public string Flags { get; set; }
        public double RaceTime { get; set; }
        public bool IsTimed { get => RaceLaps == "unlimited"; }
        public bool IsFixedLaps { get => !IsTimed; }
        public bool IsMulticlass { get; set; }
        public int LapsRemaining { get; set; }
        public bool IsActive { get; set; }
        public double ServerTime { get; set; }
        public long GameDateTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public double EstimatedRaceLaps { get; set; }
        public int EstimatedWholeRaceLaps { get; set; }
        public double LeaderLapsRemaining { get; set; }
        public int LeaderWholeLapsRemaining { get; set; }
        public Track Track { get; set; }
    }
}
