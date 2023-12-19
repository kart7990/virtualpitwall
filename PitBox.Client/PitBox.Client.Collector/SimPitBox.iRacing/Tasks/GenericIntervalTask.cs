using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public abstract class GenericIntervalTask<InputDataType> : PitBoxTask
    {
        private readonly object runLock = new object();
        private readonly int minIntervalMs;
        private DateTime lastRun;

        private bool running;
        public bool IsRunning
        {
            get
            {
                lock (runLock)
                {
                    return running;
                }
            }
            set
            {
                lock (runLock)
                {
                    running = value;
                }
            }
        }

        public GenericIntervalTask(int minIntervalMs)
        {
            this.minIntervalMs = minIntervalMs;
        }

        public async void RunIfIntervalElapsed(InputDataType data)
        {
            if (!IsRunning && (DateTime.UtcNow - lastRun).TotalMilliseconds > minIntervalMs)
            {
                IsRunning = true;
                await Run(data);
                lastRun = DateTime.UtcNow;
                IsRunning = false;
            }
        }

        public abstract Task Run(InputDataType data);
    }
}
