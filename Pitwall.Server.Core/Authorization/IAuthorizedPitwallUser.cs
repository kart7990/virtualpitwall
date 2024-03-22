namespace Pitwall.Server.Core.Authorization
{
    public interface IAuthorizedPitwallUser
    {
        Guid Id { get; }
        string Name { get; }
        string Email { get; }
    }
}
