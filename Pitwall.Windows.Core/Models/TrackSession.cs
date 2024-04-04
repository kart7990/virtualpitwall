using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class TrackSession
    {
        public int SubSessionId { get; set; }
        public int SessionNumber { get; set; }
        public string SessionType { get; set; }
        public int? PlayerCustId { get; set; }
        public bool IsSpectator { get => PlayerCustId == null; }
        public string SessionName { get; set; }
        public string EventType { get; set; }
        public string RaceLaps { get; set; }
        public string Flags { get; set; }
        public double RaceTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public bool IsTimed { get => RaceLaps == "unlimited"; }
        public bool IsRace { get => SessionName == "RACE"; }
        public bool IsQualify { get => SessionType.IndexOf("qual", StringComparison.OrdinalIgnoreCase) >= 0; }
        public bool IsPractice { get => SessionType.IndexOf("prac", StringComparison.OrdinalIgnoreCase) >= 0; }
        public bool IsFixedLaps { get => !IsTimed; }
        public bool IsMulticlass { get; set; }
        public bool IsTeamEvent { get => Cars.Any(c => c.Drivers.Count > 1); }
        public bool IsFinished { get; set; }
        public bool IsActive { get => !IsFinished; }
        public string SessionState { get; set; }
        public Track Track { get; set; } = new Track();
        public Driver Player { get; set; }
        public List<LapTelemetry> PlayerLapTelemetry { get; set; } = new List<LapTelemetry>();
        public List<Lap> LapHistory { get; set; } = new List<Lap>();
        public Condition Conditions { get; set; } = new Condition();
        [JsonIgnore]
        public List<Car> Cars { get; } = new List<Car>();
        [JsonIgnore]
        public IEnumerable<Driver> Drivers { get { return Cars.SelectMany(c => c.Drivers); } }
    }
}
