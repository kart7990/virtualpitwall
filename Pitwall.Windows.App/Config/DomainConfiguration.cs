namespace Pitwall.Windows.App.Config
{
    public class DomainConfiguration
    {
        public const string SESSION_API_PATH = "v1.0/pitwall/session";

        //TODO: Create runtime env selector for debug builds
        public static string ApiDomain
        {
            get
            {
#if DEBUG
                //UNCOMMENT IF DEV WORK DOESN'T REQUIRE API CHANGES
                //return App.Config["ApiDomainStaging"];

                return App.Config["ApiDomainLocal"];
#else
                return App.Config["ApiDomainStaging"];
#endif
            }
        }

        public static string WebAppDomain
        {
            get
            {
#if DEBUG
                //UNCOMMENT IF DEV WORK DOESN'T REQUIRE API CHANGES
                //return App.Config["WebAppDomainStaging"]; 

                return App.Config["WebAppDomainLocal"];
#else
                return App.Config["WebAppDomainStaging"];
#endif

            }
        }
    }
}
