using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.Telemetry
{
    public class BaseTelemetryProvider
    {
        public string Id { get; set; }
        public string PitwallSessionId { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string CarNumber { get; set; }
        public bool IsOnTrack { get; set; }
        public string GameUserId { get; set; }
        public string GameUserName { get; set; }
    }
}
