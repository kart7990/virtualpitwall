using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class Standing
    {
        [JsonProperty("p")]
        public int Position { get; set; }
        [JsonProperty("cp")]
        public int ClassPosition { get; set; }
        [JsonProperty("sp")]
        public int StandingPosition { get; set; }
        [JsonProperty("scp")]
        public int StandingClassPosition { get; set; }
        [JsonProperty("cn")]
        public string CarNumber { get; set; }
        [JsonProperty("cln")]
        public string ClassName { get; set; }
        [JsonProperty("ci")]
        public int ClassId { get; set; }
        [JsonProperty("cc")]
        public string ClassColor { get; set; }
        [JsonProperty("crn")]
        public string CarName { get; set; }
        [JsonProperty("cd")]
        public bool IsCurrentDriver { get; set; }
        [JsonProperty("ir")]
        public int iRating { get; set; }
        [JsonProperty("sr")]
        public string SR { get; set; }
        [JsonProperty("dn")]
        public string DriverName { get; set; }
        [JsonProperty("dns")]
        public string DriverShortName { get; set; }
        [JsonProperty("d")]
        public double LapDistancePercent { get; set; }
        [JsonProperty("t")]
        public string TeamName { get; set; }
        [JsonProperty("ld")]
        public string LeaderDelta { get; set; }
        [JsonProperty("nd")]
        public string NextCarDelta { get; set; }
        [JsonProperty("lt")]
        public long LastLaptime { get; set; }
        [JsonProperty("bt")]
        public long BestLaptime { get; set; }
        [JsonProperty("ln")]
        public int? Lap { get; set; }
        [JsonProperty("pc")]
        public int? PitStopCount { get; set; }
        [JsonProperty("sl")]
        public int? StintLapCount { get; set; }
    }
}
