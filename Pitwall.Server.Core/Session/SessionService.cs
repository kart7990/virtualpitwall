using Pitwall.Core.Models;
using Pitwall.Server.Core.Authorization;
using Pitwall.Server.Core.Session.Cache;

namespace Pitwall.Server.Core.Session
{
    public class SessionService(IPitwallUser user, PitwallSessionRepo pitwallSessionRepo)
    {
        public async Task<PitwallSession> CreateSession()
        {
            var pitwallSession = new PitwallSession() { Id = Guid.NewGuid().ToString(), CreatorUserId = user.Id };

            await pitwallSessionRepo.Add(pitwallSession);

            return pitwallSession;
        }
    }
}
