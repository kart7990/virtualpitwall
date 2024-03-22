using PitBox.Server.Core.Data.Cache;
using Pitwall.Core.Models;
using Pitwall.Server.Core.Authorization;

namespace Pitwall.Server.Core.Session
{
    public class SessionService(IAuthorizedPitwallUser user, PitwallSessionRepo pitwallSessionRepo)
    {
        public async Task<PitwallSession> CreateSession()
        {
            var pitwallSession = new PitwallSession() { Id = Guid.NewGuid().ToString(), CreatorUserId = user.Id };

            await pitwallSessionRepo.Add(pitwallSession);

            return pitwallSession;
        }
    }
}
