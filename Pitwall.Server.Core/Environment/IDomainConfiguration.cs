namespace Pitwall.Server.Core.Environment
{
    public interface IDomainConfiguration
    {
        Uri WebAppDomain { get; }
        Uri ApiUrl { get; }
    }
}
