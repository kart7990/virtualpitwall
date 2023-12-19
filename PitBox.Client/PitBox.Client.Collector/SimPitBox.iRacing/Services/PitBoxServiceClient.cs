using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Services
{
    public class PitBoxServiceClient
    {
        private readonly HttpClient httpClient;

        public PitBoxServiceClient()
        {
            this.httpClient = new HttpClient();
        }

        public async Task<HttpResponseMessage> Put<T>(Uri uploadUrl, T content)
        {
            var json = Serialize(content);
            return await PutJson(uploadUrl, json);
        }

        public async Task<HttpResponseMessage> Post<T>(Uri uploadUrl, T content)
        {
            var json = Serialize(content);
            return await PostJson(uploadUrl, json);
        }

        private string Serialize<T>(T content)
        {
            DefaultContractResolver contractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            };
            string json = JsonConvert.SerializeObject(content, new JsonSerializerSettings
            {
                ContractResolver = contractResolver,
                Formatting = Formatting.None
            });
            return json;
        }

        private async Task<HttpResponseMessage> PostJson(Uri uploadUrl, string json)
        {
            try
            {
                return await Task.Run(async () =>
                {
                    //Log("Data Post", json);
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                    var response = await httpClient.PostAsync(uploadUrl, httpContent);
                    if (!response.IsSuccessStatusCode)
                    {
                        Log("Request Failed", uploadUrl.ToString() + ":" + json);
                    }
                    return response;
                });
            }
            catch (Exception e)
            {
                Log("Exception Sending Request", uploadUrl.ToString() + ":" + json);
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

        }

        public async Task<HttpResponseMessage> PutJson(Uri uploadUrl, string json)
        {
            try
            {
                return await Task.Run(async () =>
                {
                    //Log("Data Put", json);
                    var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                    var response = await httpClient.PutAsync(uploadUrl, httpContent);
                    if (!response.IsSuccessStatusCode)
                    {
                        Log("Request Failed", uploadUrl.ToString() + ":" + json);
                    }
                    return response;
                });
            }
            catch (Exception e)
            {
                Log("Exception Sending Request", uploadUrl.ToString() + ":" + json);
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }

        }

        private void Log(string title, string message)
        {
            Debug.WriteLine("SimPit:" + DateTime.Now + ":" + title + ":" + message);
        }
    }
}
