using Newtonsoft.Json;
using SimPitBox.iRacing.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public abstract class IntervalUploadTask<InputDataType, UploadDataType> : GenericIntervalTask<InputDataType>
    {
        private readonly TaskServiceClient taskServiceClient;
        protected readonly Uri postPath;

        public IntervalUploadTask(TaskServiceClient taskServiceClient, Uri postPath, int minIntervalMs = 100) : base(minIntervalMs)
        {
            this.taskServiceClient = taskServiceClient;
            this.postPath = postPath;
        }

        public override async Task Run(InputDataType data)
        {
            var content = GetDataForUpload(data);
            await taskServiceClient.PostTaskData(postPath, content);
        }

        public abstract UploadDataType GetDataForUpload(InputDataType inputData);
    }

}
