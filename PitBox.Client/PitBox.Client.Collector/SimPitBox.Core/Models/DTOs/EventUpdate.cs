using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace SimPitBox.Core.Models.DTOs
{
    public class EventUpdate
    {
        public string Type { get; set; }
        public int CurrentSessionNumber { get; set; } = -1;

        public static EventUpdate FromEvent(Event trackEvent)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Event, EventUpdate>());
            return config.CreateMapper().Map<EventUpdate>(trackEvent);
        }
    }
}
