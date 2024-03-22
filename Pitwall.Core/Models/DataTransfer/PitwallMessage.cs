using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.DataTransfer
{
    public class PitwallMessage<T> : TimeBasedPitwallMessage
    {
        public T Data { get; set; }
    }
}
