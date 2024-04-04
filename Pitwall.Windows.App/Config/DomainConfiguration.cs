namespace Pitwall.Windows.App.Config
{
    public class DomainConfiguration
    {
        public const string SESSION_API_PATH = "v1.0/pitwall/session";

        public static string ApiDomain
        {
            get
            {
                //return App.Config["ApiDomainLocal"];
                return App.Config["ApiDomainStaging"];
            }
        }

        public static string WebAppDomain
        {
            get
            {
                //return App.Config["WebAppDomainLocal"];
                return App.Config["WebAppDomainStaging"];
            }
        }
    }
}
