namespace Pitwall.Server.Core.Authorization.Models
{
    public class AuthorizedTestUser(Guid id, string email, string name) : IAuthorizedPitwallUser
    {
        public Guid Id => id;
        public string Email => email;
        public string Name => name;

    }
}
