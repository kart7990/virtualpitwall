using SimPitBox.iRacing.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public class TaskServiceClient
    {
        private readonly PitBoxServiceClient pitBoxServiceClient;

        public TaskServiceClient(PitBoxServiceClient pitBoxServiceClient)
        {
            this.pitBoxServiceClient = pitBoxServiceClient;
        }

        public bool Enabled { get; set; }

        public async Task PostTaskData<T>(Uri uploadUrl, T content)
        {
            if (Enabled)
            {
                await pitBoxServiceClient.Post(uploadUrl, content);
            }
        }

        public async Task PutTaskData<T>(Uri uploadUrl, T content)
        {
            if (Enabled)
            {
                await pitBoxServiceClient.Put(uploadUrl, content);
            }
        }

        private void Log(string title, string message)
        {
            Debug.WriteLine("SimPit:" + DateTime.Now + ":" + title + ":" + message);
        }
    }
}
