namespace Pitwall.Core.Models.DataTransfer
{
    public class PitwallSessionResponse
    {
        public PitwallSession PitwallSession { get; set; }
        public Dictionary<HubEndpoint, string> WebSocketEndpoints { get; set; }
    }
}
