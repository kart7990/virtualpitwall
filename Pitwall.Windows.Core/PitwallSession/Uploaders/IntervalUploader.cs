using iRacingSdkWrapper;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    public abstract class IntervalUploader<InputDataType> : IConditionalTelemetryTask
    {
        private readonly object runLock = new();
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

        public abstract bool TelemetryUpdateRequiresActiveSession { get; }
        public abstract bool RequiresCarOnTrack { get; }

        public IntervalUploader(int minIntervalMs)
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
        public abstract void OnTelemetryUpdate(TelemetryInfo telemetryInfo);
    }
}
