namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizationConfiguration
    {
        string JwtKey { get; }
        string JwtIssuer { get; }
        string JwtAudience { get; }
        int JwtWebExpireSeconds { get; }
    }
}
