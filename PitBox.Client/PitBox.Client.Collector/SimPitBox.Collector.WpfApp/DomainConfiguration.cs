using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp
{
    public static class DomainConfiguration
    {
        //private const string API_DEV = "http://localhost:5444";
        private const string API_DEV = "https://virtualpitwall-test.azurewebsites.net/api/";
        private const string API_TEST = "https://virtualpitwall-test.azurewebsites.net/api/";
        private const string API_PROD = "https://virtualpitwall-test.azurewebsites.net/api/";

        private const string WEBAPP_DEV = "http://localhost:3001";
        private const string WEBAPP_PROD = "";

        public static string ApiDomain
        {
            get
            {
                string domain;
#if DEBUG
                domain = API_DEV;
#elif TEST
                domain = API_TEST;
#else
                domain = API_PROD;
#endif
                return domain;
            }
        }

        public static string WebAppDomain
        {
            get
            {
                string domain = null;
#if DEBUG
                domain = WEBAPP_DEV;
#elif TEST
                domain = WEBAPP_DEV;
#else
                domain = WEBAPP_PROD;
#endif
                return domain;
            }
        }
    }
}
