using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SimPitBox.Core.Models.DTOs
{
    public class SessionUpdate
    {
        [JsonProperty("sessionNumber")]
        public int SessionNumber { get; set; }

        [JsonProperty("sessionName")]
        public string SessionName { get; set; }

        [JsonProperty("raceLaps")]
        public string RaceLaps { get; set; }

        [JsonProperty("raceTime")]
        public double RaceTime { get; set; }

        [JsonProperty("raceTimeRemaining")]
        public double RaceTimeRemaining { get; set; }

        [JsonProperty("isFinished")]
        public bool IsFinished { get; set; }

        [JsonProperty("sessionState")]
        public string SessionState { get; set; }

        public static SessionUpdate FromSession(Session session)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Session, SessionUpdate>());
            return config.CreateMapper().Map<SessionUpdate>(session);
        }
    }
}
