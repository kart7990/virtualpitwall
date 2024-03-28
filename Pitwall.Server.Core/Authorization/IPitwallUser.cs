namespace Pitwall.Server.Core.Authorization
{
    public interface IPitwallUser
    {
        Guid Id { get; }
        string Name { get; }
        string Email { get; }
    }
}
