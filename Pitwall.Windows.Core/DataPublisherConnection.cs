using Microsoft.AspNetCore.SignalR.Client;

namespace Pitwall.Windows.Core
{
    public class DataPublisherConnection
    {
        public string ProviderId { get; set; }
        public HubConnection Connection { get; set; }
    }
}
