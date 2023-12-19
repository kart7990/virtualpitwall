using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public abstract class PitBoxTask
    {
        public void Log(string title, string message)
        {
            Debug.WriteLine("SimPit:" + DateTime.Now + ":" + title + ":" + message);
        }
    }
}
