using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;
using SimPitBox.Core.Models;
using System.Windows.Media;
using System.Windows.Controls;
using SimPitBox.Collector.WpfApp.Authentication;
using PitBox.Core.Models;
using Microsoft.Extensions.DependencyInjection;

namespace SimPitBox.Collector.WpfApp
{
    /// <summary>
    /// Interaction logic for SessionPage.xaml
    /// </summary>
    public partial class SessionPage : Page
    {
        private const int SIM_UPDATE_FREQ = 30;
        private const int TELEMETRY_UPLOAD_INTERVAL = 250;
        private HubConnection pitboxSessionHubConnection;
        private HubConnection standingsHubConnection;
        private HubConnection lapsHubConnection;
        private HubConnection telemetryHubConnection;
        private RealTimeDataTask realTimeDataTask = new RealTimeDataTask();
        private iRacing.PitBoxEngine pitBox;

        private HttpClient apiHttpClient = new HttpClient()
        {
            BaseAddress = new Uri(DomainConfiguration.ApiDomain)
        };

        private PitBoxSession session;

        private static string driversDataJson = JsonConvert.SerializeObject(new List<iRacingSimulator.Drivers.Driver>());
        public SessionPage()
        {
            InitializeComponent();
            txtUserName.Text = "Welcome, " + AuthenticationState.Name;
        }

        private async void StartSession_Click(object sender, RoutedEventArgs e)
        {
            appReady.Visibility = Visibility.Collapsed;
            btnStartSession.Visibility = Visibility.Collapsed;
            progressIndicator.Visibility = Visibility.Visible;
            iracingConnection.Visibility = Visibility.Visible;
            serverConnection.Visibility = Visibility.Visible;
            serverConnection.Content = "Server: Connecting...";
            serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");

            iracingConnection.Content = "iRacing: Connecting...";
            iracingConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#e1a82d");

            apiHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", AuthenticationState.AccessToken);

            var response = await apiHttpClient.PostAsync("v1.0/pitbox/session", null);
            var jsonString = await response.Content.ReadAsStringAsync();
            var sessionDetails = JsonConvert.DeserializeObject<SessionDetails>(jsonString);
            session = new PitBoxSession()
            {
                Id = sessionDetails.Session.Id
            };


            foreach (var hubEndpoint in sessionDetails.WebSocketEndpoints)
            {
                var connection = await BuildConnection(hubEndpoint.Value, sessionDetails.Session.Id);

                switch (hubEndpoint.Key)
                {
                    case HubEndpoint.Session:
                        pitboxSessionHubConnection = connection;
                        break;
                    case HubEndpoint.Standings:
                        standingsHubConnection = connection;
                        break;
                    case HubEndpoint.Laps:
                        lapsHubConnection = connection;
                        break;
                    case HubEndpoint.Telemetry:
                        telemetryHubConnection = connection;
                        break;
                }
            }

            try
            {
                ShowSession(session.Event);
                serverConnection.Content = "Server: Connected";
                serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#45a164");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                serverConnection.Content = "Server Connection Failed";
                serverConnection.Foreground = (Brush)new BrushConverter().ConvertFrom("#d16767");
            }
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

        private void ShowSession(Core.Models.Event existingEvent)
        {
            progressIndicator.Visibility = Visibility.Hidden;
            viewSessionLink.Visibility = Visibility.Visible;

            lblSessionLink.Text = DomainConfiguration.WebAppDomain + "/pitbox/" + session.Id + "/dashboard";
            Sim.Instance.Connected += Instance_Connected;
            Sim.Instance.Disconnected += Instance_Disconnected;

            pitBox = new iRacing.PitBoxEngine(session.Id, pitboxSessionHubConnection, standingsHubConnection, lapsHubConnection, telemetryHubConnection);
            pitBox.Start(SIM_UPDATE_FREQ);
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
            Clipboard.SetText(lblSessionLink.Text);
        }

        private async void btnStopSession_Click(object sender, RoutedEventArgs e)
        {
            pitBox.Stop();
            await pitboxSessionHubConnection.StopAsync();
            await standingsHubConnection.StopAsync();
            await lapsHubConnection.StopAsync();
            await telemetryHubConnection.StopAsync();
            standingsHubConnection.Closed -= HubConnection_Closed;
            pitboxSessionHubConnection.Closed -= HubConnection_Closed;
            lapsHubConnection.Closed -= HubConnection_Closed;
            telemetryHubConnection.Closed -= HubConnection_Closed;
            viewSessionLink.Visibility = Visibility.Collapsed;
            appReady.Visibility = Visibility.Visible;
            btnStartSession.Visibility = Visibility.Visible;
            iracingConnection.Visibility = Visibility.Collapsed;
            serverConnection.Visibility = Visibility.Collapsed;
        }

        private async Task<HubConnection> BuildConnection(string hubEndpoint, string sessionId)
        {
            var connection = new HubConnectionBuilder()
               .WithUrl(DomainConfiguration.ApiDomain + hubEndpoint + "?sessionId=" + sessionId, options =>
               {
                   options.AccessTokenProvider = () => Task.FromResult(AuthenticationState.AccessToken);
               })
               .AddNewtonsoftJsonProtocol()
               .WithAutomaticReconnect()
               .Build();


            await connection.StartAsync();

            //todo: should we just have 1 master connection? session?
            connection.Closed += HubConnection_Closed;
            return connection;
        }
    }
}
