using iRacingSimulator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks.Sessions
{
    public interface ISessionTask
    {
        void OnSessionUpdate(SessionData sessionData);
    }
}
