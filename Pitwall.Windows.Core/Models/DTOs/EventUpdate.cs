using AutoMapper;
using Pitwall.Windows.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Windows.Core.Models.DTOs
{
    public class EventUpdate
    {
        public string Type { get; set; }
        public int CurrentSessionNumber { get; set; } = -1;

        public static EventUpdate FromEvent(GameSession trackEvent)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<GameSession, EventUpdate>());
            return config.CreateMapper().Map<EventUpdate>(trackEvent);
        }
    }
}
