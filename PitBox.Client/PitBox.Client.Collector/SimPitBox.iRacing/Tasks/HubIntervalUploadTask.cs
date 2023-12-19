using Microsoft.AspNetCore.SignalR.Client;
using PitBox.Core.SessionData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public abstract class HubIntervalUploadTask<InputDataType, UploadDataType> : GenericIntervalTask<InputDataType>
    {
        private readonly HubConnection hubConnection;
        private readonly string hubUploadMethodName;
        private DateTime requestTime = new DateTime();
        private DateTime acknowledgeTime = DateTime.UtcNow;

        public HubIntervalUploadTask(HubConnection hubConnection, string hubUploadMethodName, string hubAckMethodName, int minIntervalMs = 100) : base(minIntervalMs)
        {
            this.hubConnection = hubConnection;
            this.hubUploadMethodName = hubUploadMethodName;
            hubConnection.On(hubAckMethodName, () =>
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
