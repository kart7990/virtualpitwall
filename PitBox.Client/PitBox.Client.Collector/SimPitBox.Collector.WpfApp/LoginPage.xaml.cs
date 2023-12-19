using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using Newtonsoft.Json;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using SimPitBox.Collector.WpfApp.Authentication;
using JWT.Builder;
using JWT.Algorithms;

namespace SimPitBox.Collector.WpfApp
{
    /// <summary>
    /// Interaction logic for LoginPage.xaml
    /// </summary>
    public partial class LoginPage : Page
    {
        string authorizationEndpoint = DomainConfiguration.WebAppDomain + "/login";

        public LoginPage()
        {
            InitializeComponent();
        }

        private async void btnGoogleLogin_Click(object sender, RoutedEventArgs e)
        {
            // Creates a redirect URI using an available port on the loopback address.
            string redirectURI = string.Format("http://{0}:{1}/virtualpitbox/authentication/", IPAddress.Loopback, GetRandomUnusedPort());
            output("redirect URI: " + redirectURI);

            // Creates an HttpListener to listen for requests on that redirect URI.
            var http = new HttpListener();
            http.Prefixes.Add(redirectURI);
            output("Listening..");
            http.Start();

            // Creates the OAuth 2.0 authorization request.
            string authorizationRequest = string.Format("{0}?redirect_uri={1}", authorizationEndpoint, Uri.EscapeDataString(redirectURI));

            // Opens request in the browser.
            System.Diagnostics.Process.Start(authorizationRequest);

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

            AuthenticationState.AccessToken = accessToken;

            SessionPage sessionPage = new SessionPage();
            NavigationService.Navigate(sessionPage);

            output("Authorization Token: " + accessToken);
        }

        /// <summary>
        /// Appends the given string to the on-screen log, and the debug console.
        /// </summary>
        /// <param name="output">string to be appended</param>
        private void output(string output)
        {
            Console.WriteLine(output);
        }

        // ref http://stackoverflow.com/a/3978040
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
