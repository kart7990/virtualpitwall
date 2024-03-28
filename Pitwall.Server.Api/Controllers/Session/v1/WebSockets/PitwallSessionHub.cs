using Microsoft.AspNetCore.SignalR;

namespace Pitwall.Server.Api.Controllers.Session.v1.WebSockets
{
    public class PitwallSessionHub : Hub<IPitwallSessionCallbacks>
    {
        public const string VERSION = "/v1.0";
        public const string PATH = VERSION + "/pitwall";

        public override async Task OnConnectedAsync()
        {
            var sessionId = Context.GetHttpContext().Request.Query.Single(k => k.Key == "sessionId").Value;
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
