using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class TrackSession
    {
        public int SessionNumber { get; set; }
        public string SessionType { get; set; }
        public string SessionName { get; set; }
        public string RaceLaps { get; set; }
        public string Flags { get; set; }
        public double RaceTime { get; set; }
        public bool IsTimed { get => RaceLaps == "unlimited"; }
        public bool IsRace { get => SessionName == "RACE"; }
        public bool IsQualify { get => SessionType.IndexOf("qual", StringComparison.OrdinalIgnoreCase) >= 0; }
        public bool IsPractice { get => SessionType.IndexOf("prac", StringComparison.OrdinalIgnoreCase) >= 0; }
        public bool IsFixedLaps { get => !IsTimed; }
        public bool IsMulticlass { get; set; }
        public int? PlayerCustId { get; set; }
        public bool IsSpectator { get => PlayerCustId == null; }
        public Track Track { get; set; }
    }
}
