using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Pitwall.Core.Models;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Windows.App.Auth;
using Pitwall.Windows.App.Config;
using Pitwall.Windows.Core;
using System.Diagnostics;
using System.Net.Http;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Navigation;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for PitwallSessionPage.xaml
    /// </summary>
    public partial class PitwallSessionPage : Page
    {
        private const int SIM_UPDATE_FREQ_MS = 30;

        private PitwallDataEngine pitwallDataEngine;
        private HubConnection gameDataPublisherConnection;
        private HubConnection telemetryPublisherConnection;

        private HttpClient apiHttpClient = new HttpClient()
        {
            BaseAddress = new Uri(DomainConfiguration.ApiDomain)
        };

        public PitwallSessionPage(PitwallSessionNavArgs pitwallSessionNavArgs)
        {
            InitializeComponent();
            txtUserName.Text = "Welcome, " + AuthorizationState.Name;
            apiHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", AuthorizationState.AccessToken);
            ConnectToSession(pitwallSessionNavArgs);
        }

        private async void ConnectToSession(PitwallSessionNavArgs pitwallSessionNavArgs)
        {
            appReady.Visibility = Visibility.Collapsed;
            progressIndicator.Visibility = Visibility.Visible;
            iracingConnection.Visibility = Visibility.Visible;
            serverConnection.Visibility = Visibility.Visible;
            serverConnection.Content = "Server: Connecting...";
            serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");

            iracingConnection.Content = "iRacing: Connecting...";
            iracingConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");

            try
            {
                DataPublisherConnection gameDataProviderConnection = null;
                DataPublisherConnection telemetryProviderConnection = null;

                if (pitwallSessionNavArgs.SessionDataProvider)
                {
                    gameDataProviderConnection = await CreateSessionDataProviderConnection(pitwallSessionNavArgs.Session);
                }

                if (pitwallSessionNavArgs.TelemetryDataProvider)
                {
                    telemetryProviderConnection = await CreateTelemetryProviderConnection(pitwallSessionNavArgs.Session);
                }

                progressIndicator.Visibility = Visibility.Hidden;
                viewSessionLink.Visibility = Visibility.Visible;
                lblSessionLink.Text = DomainConfiguration.WebAppDomain + "/pitwall/dashboard/" + pitwallSessionNavArgs.Session.Id;
                serverConnection.Content = "Server: Connected";
                serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#45a164");
                StartPitwallGameEngine(pitwallSessionNavArgs.Session, gameDataProviderConnection, telemetryProviderConnection);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                serverConnection.Content = "Server Connection Failed";
                serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#d16767");
            }
        }

        private async Task<DataPublisherConnection> CreateSessionDataProviderConnection(PitwallSession session)
        {
            //Register as game data provider
            var createDataProviderResponse = await apiHttpClient.PostAsync($"{DomainConfiguration.SESSION_API_PATH}/{session.Id}/gamedata/providers", null);
            var dataProviderJsonString = await createDataProviderResponse.Content.ReadAsStringAsync();
            var gameDataProvider = JsonConvert.DeserializeObject<GameDataProvider>(dataProviderJsonString);

            //Connect to game data publisher websocket
            const string VERSION = "/v1.0";
            const string PATH = VERSION + "/pitwall/gamedatapublisher";

            gameDataPublisherConnection = await BuildConnection(PATH, session.Id, new Dictionary<string, string>() { { "dataProviderId", gameDataProvider.Id } });

            return new DataPublisherConnection() { ProviderId = gameDataProvider.Id, Connection = gameDataPublisherConnection };
        }

        private async Task<DataPublisherConnection> CreateTelemetryProviderConnection(PitwallSession session)
        {
            //Register as game data provider
            var telemetryProviderResponse = await apiHttpClient.PostAsync($"{DomainConfiguration.SESSION_API_PATH}/{session.Id}/telemetry/providers", null);
            var jsonString = await telemetryProviderResponse.Content.ReadAsStringAsync();
            var telemetryProvider = JsonConvert.DeserializeObject<TelemetryProvider>(jsonString);

            //Connect to game data publisher websocket
            const string VERSION = "/v1.0";
            const string PATH = VERSION + "/pitwall/telemetrypublisher";

            telemetryPublisherConnection = await BuildConnection(PATH, session.Id, new Dictionary<string, string>() { { "dataProviderId", telemetryProvider.Id } });

            return new DataPublisherConnection() { ProviderId = telemetryProvider.Id, Connection = telemetryPublisherConnection };
        }


        private async Task<HubConnection> BuildConnection(string hubEndpoint, string sessionId, Dictionary<string, string> queryParams)
        {
            var url = DomainConfiguration.ApiDomain + hubEndpoint + "?sessionId=" + sessionId;

            foreach (var kvp in queryParams)
            {
                url = ($"{url}&{kvp.Key}={kvp.Value}");
            }

            var connection = new HubConnectionBuilder()
               .WithUrl(url, options =>
               {
                   options.AccessTokenProvider = () => Task.FromResult(AuthorizationState.AccessToken);
               })
               .AddNewtonsoftJsonProtocol()
               .WithAutomaticReconnect()
               .Build();

            await connection.StartAsync();

            //todo: should we just have 1 master connection? session?
            connection.Closed += HubConnection_Closed;
            return connection;
        }

        private async Task<PitwallSession> JoinSession(string sessionId)
        {
            appReady.Visibility = Visibility.Collapsed;
            serverConnection.Content = "Server: Connecting...";
            serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");

            iracingConnection.Content = "iRacing: Connecting...";
            iracingConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");
            var response = await apiHttpClient.GetAsync(DomainConfiguration.SESSION_API_PATH + "/" + sessionId);

            var jsonString = await response.Content.ReadAsStringAsync();
            var pitwallSession = JsonConvert.DeserializeObject<PitwallSessionResponse>(jsonString).PitwallSession;
            return pitwallSession;
        }

        private Task HubConnection_Closed(Exception arg)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                serverConnection.Content = "Server Disconnected";
                serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");
            });
            return Task.FromResult(0);
        }

        private void StartPitwallGameEngine(PitwallSession pitwallSession, DataPublisherConnection gameDataProviderConnection = null, DataPublisherConnection telemetryProviderConnection = null)
        {
            Sim.Instance.Connected += Instance_Connected;
            Sim.Instance.Disconnected += Instance_Disconnected;

            pitwallDataEngine = new PitwallDataEngine(pitwallSession.Id, gameDataProviderConnection, telemetryProviderConnection);
            pitwallDataEngine.Start(SIM_UPDATE_FREQ_MS);
        }
        private void Instance_Disconnected(object sender, EventArgs e)
        {
            iracingConnection.Content = "iRacing: Disconnected";
            iracingConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#d16767");
        }

        private void Instance_Connected(object sender, EventArgs e)
        {
            iracingConnection.Content = "iRacing: Connected";
            iracingConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#45a164");
        }

        private void btnCopy_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                Clipboard.SetText(lblSessionLink.Text);
            }
            catch
            {
                //no-op
            }
        }

        private async void btnStopSession_Click(object sender, RoutedEventArgs e)
        {
            pitwallDataEngine.Stop();

            if (gameDataPublisherConnection != null)
            {
                await gameDataPublisherConnection.StopAsync();
                gameDataPublisherConnection.Closed -= HubConnection_Closed;
            }

            if (telemetryPublisherConnection != null)
            {
                await telemetryPublisherConnection.StopAsync();
                telemetryPublisherConnection.Closed -= HubConnection_Closed;
            }

            viewSessionLink.Visibility = Visibility.Collapsed;
            appReady.Visibility = Visibility.Visible;
            iracingConnection.Visibility = Visibility.Collapsed;
            serverConnection.Visibility = Visibility.Collapsed;
            //Nav back to main page
            NavigationService.RemoveBackEntry();
            NavigationService.GoBack();
        }
    }
}
