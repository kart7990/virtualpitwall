using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp
{
    public class IntervalUploader<T>
    {
        private readonly object uploadLock = new object();
        private readonly HttpClient httpClient;
        private readonly Uri uploadUrl;
        private readonly int minIntervalMs;
        private DateTime lastSent;

        private bool uploading;
        public bool IsUploading
        { 
            get
            {
                lock (uploadLock)
                {
                    return uploading;
                }
            }
            set
            {
                lock (uploadLock)
                {
                    uploading = value;
                }
            }
        }

        public IntervalUploader(Uri uploadUrl, int minIntervalMs)
        {
            this.httpClient = new HttpClient();
            this.uploadUrl = uploadUrl;
            this.minIntervalMs = minIntervalMs;
        }

        public async void SendIfIntervalElapsed(T content)
        {
            if(!IsUploading && (DateTime.UtcNow - lastSent).TotalMilliseconds > minIntervalMs)
            {
                IsUploading = true;
                var json = JsonConvert.SerializeObject(content);
                await Task.Run(async () =>
                {
                    //Debug.WriteLine(json);
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                    await httpClient.PostAsync(uploadUrl, httpContent);
                    lastSent = DateTime.UtcNow;
                });
                IsUploading = false;
            }
        }
    }
}
