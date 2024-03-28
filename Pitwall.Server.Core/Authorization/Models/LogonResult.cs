namespace Pitwall.Server.Core.Authorization.Models
{
    public class AuthorizationResult
    {
        public AuthorizationResult(JsonWebToken jwt, IPitwallUser pitwallUser)
        {
            Jwt = jwt;
            PitwallUser = pitwallUser;
        }

        public JsonWebToken Jwt { get; private set; }
        public IPitwallUser PitwallUser { get; }
    }
}
