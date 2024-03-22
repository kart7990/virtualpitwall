using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.DataTransfer
{
    public class BasePitwallMessage
    {
        public string GameAssignedSessionId { get; set; }
        public string ProviderId { get; set; }
        public string SessionId { get; set; }
        public string TeamId { get; set; }
    }
}
