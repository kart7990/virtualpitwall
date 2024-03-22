using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.DataTransfer
{
    public class TimeBasedPitwallMessage : BasePitwallMessage
    {
        public double SessionElapsedTime { get; set; }
        public int SessionNumber { get; set; }
    }
}
