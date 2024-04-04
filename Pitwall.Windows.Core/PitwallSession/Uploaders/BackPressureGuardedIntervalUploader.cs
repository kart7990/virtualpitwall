using Microsoft.AspNetCore.SignalR.Client;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    internal abstract class BackPressureGuardedIntervalUploader<InputDataType, UploadDataType> : IntervalUploader<InputDataType>
    {
        private readonly HubConnection hubConnection;
        private readonly string hubUploadMethodName;
        private DateTime requestTime = new DateTime();
        private DateTime acknowledgeTime = DateTime.UtcNow;

        public BackPressureGuardedIntervalUploader(HubConnection hubConnection, string hubUploadMethodName, string hubAcknowledgeMethodName, int minIntervalMs = 100) : base(minIntervalMs)
        {
            this.hubConnection = hubConnection;
            this.hubUploadMethodName = hubUploadMethodName;
            hubConnection.On(hubAcknowledgeMethodName, () =>
            {
                acknowledgeTime = DateTime.UtcNow;
            });
        }

        public override async Task Run(InputDataType data)
        {
            if (CanSend)
            {
                var content = GetDataForUpload(data);
                requestTime = DateTime.UtcNow;
                await hubConnection.SendAsync(hubUploadMethodName, content);
            }
        }

        public abstract UploadDataType GetDataForUpload(InputDataType inputData);

        public bool CanSend => acknowledgeTime > requestTime;
    }
}
