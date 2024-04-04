using Pitwall.Windows.App.Auth;
using Pitwall.Windows.App.Config;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Windows;
using System.Windows.Controls;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for LoginPage.xaml
    /// </summary>
    public partial class LoginPage : Page
    {
        private static string authorizationEndpoint = DomainConfiguration.WebAppDomain + "/auth/login";

        public LoginPage()
        {
            InitializeComponent();
            var version = Environment.GetEnvironmentVariable("ClickOnce_CurrentVersion");
#if DEBUG
            version = "debug";
#endif

            txtVersion.Text = version;
        }

        private async void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            // Creates a redirect URI using an available port on the loopback address.
            string redirectURI = string.Format("http://{0}:{1}/virtualpitbox/authentication/", IPAddress.Loopback, GetRandomUnusedPort());

            // Creates an HttpListener to listen for requests on that redirect URI.
            var http = new HttpListener();
            http.Prefixes.Add(redirectURI);
            http.Start();

            // Creates the OAuth 2.0 authorization request.
            string authorizationRequest = string.Format("{0}?redirect_uri={1}", authorizationEndpoint, Uri.EscapeDataString(redirectURI));

            // Opens request in the browser.
            Process.Start(new ProcessStartInfo(authorizationRequest) { UseShellExecute = true });


            // Waits for the OAuth authorization response.
            var context = await http.GetContextAsync();

            // Sends an HTTP response to the browser.
            var response = context.Response;
            response.Headers.Add("Access-Control-Allow-Origin", DomainConfiguration.WebAppDomain);
            response.Headers.Add("Access-Control-Allow-Headers", "Authorization, cache-control, expires");
            response.StatusCode = 204;
            response.Close();
            //response.Headers.Add()

            context = await http.GetContextAsync();
            response = context.Response;
            var accessToken = context.Request.Headers.Get("Authorization");
            response.Headers.Add("Access-Control-Allow-Origin", DomainConfiguration.WebAppDomain);
            response.StatusCode = 200;
            response.Close();
            http.Stop();

            // Brings this app back to the foreground.
            var window = Window.GetWindow(this);
            window.Activate();

            AuthorizationState.AccessToken = accessToken;

            //MainPage pitwallPage = new MainPage();
            //NavigationService.Navigate(pitwallPage);
        }

        private static int GetRandomUnusedPort()
        {
            var listener = new TcpListener(IPAddress.Loopback, 0);
            listener.Start();
            var port = ((IPEndPoint)listener.LocalEndpoint).Port;
            listener.Stop();
            return port;
        }
    }
}
