namespace Pitwall.Windows.App.Config
{
    public class DomainConfiguration
    {
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
