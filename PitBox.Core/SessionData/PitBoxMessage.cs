using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.SessionData
{
    public class PitBoxMessage<T> : TimeBasedPitBoxMessage
    {
        public T Data { get; set; }
    }
}
