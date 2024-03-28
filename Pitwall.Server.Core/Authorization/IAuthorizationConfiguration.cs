namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizationConfiguration
    {
        bool IsTestUserEnabled { get; }
        string JwtKey { get; }
        string JwtIssuer { get; }
        string JwtAudience { get; }
        int JwtWebExpireSeconds { get; }
    }
}
