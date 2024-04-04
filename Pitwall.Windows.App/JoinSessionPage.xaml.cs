using Newtonsoft.Json;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Windows.App.Auth;
using Pitwall.Windows.App.Config;
using System.Net.Http;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for JoinSessionPage.xaml
    /// </summary>
    public partial class JoinSessionPage : Page
    {
        public JoinSessionPage()
        {
            InitializeComponent();
            txtUserName.Text = "Welcome, " + AuthorizationState.Name;
            chkSessionData.Checked += chkDataProvider_Toggled;
        }

        private void ValidateSessionConfig()
        {
            if (IsDataProviderTypeSelected() && !string.IsNullOrEmpty(txtSessionId.Text))
            {
                btnJoinSession.IsEnabled = true;
            }
            else
            {
                btnJoinSession.IsEnabled = false;
            }
        }


        private void DisplayErrorIfNoDataProviderTypeSelected()
        {
            if (IsDataProviderTypeSelected())
            {
                lblDataProviderSelectionError.Visibility = Visibility.Collapsed;
            }
            else
            {
                lblDataProviderSelectionError.Visibility = Visibility.Visible;
            }
        }

        private bool IsDataProviderTypeSelected()
        {
            return chkSessionData.IsChecked == true || chkTelemetryData.IsChecked == true;
        }

        private void chkDataProvider_Toggled(object sender, RoutedEventArgs e)
        {
            DisplayErrorIfNoDataProviderTypeSelected();
            ValidateSessionConfig();
        }

        private async void btnJoinSession_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                lblJoinSessionError.Visibility = Visibility.Collapsed;
                progressIndicator.Visibility = Visibility.Visible;
                content.Visibility = Visibility.Collapsed;

                var sessionLink = txtSessionId.Text;

                var sessionUri = new Uri(sessionLink);
                string sessionId = sessionUri.AbsolutePath.Substring(sessionUri.AbsolutePath.LastIndexOf("/") + 1);

                if (sessionId.Contains("/"))
                {
                    sessionId = sessionId.Substring(0, sessionId.IndexOf("/"));
                }

                using (HttpClient apiHttpClient = new HttpClient() { BaseAddress = new Uri(DomainConfiguration.ApiDomain) })
                {
                    apiHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", AuthorizationState.AccessToken);
                    //Create session
                    var response = await apiHttpClient.GetAsync(DomainConfiguration.SESSION_API_PATH + "/" + sessionId);

                    var jsonString = await response.Content.ReadAsStringAsync();
                    var pitwallSession = JsonConvert.DeserializeObject<PitwallSessionResponse>(jsonString).PitwallSession;

                    if (pitwallSession == null)
                    {
                        throw new ArgumentNullException(nameof(pitwallSession));
                    }

                    PitwallSessionPage pitwallSessionPage = new PitwallSessionPage(new PitwallSessionNavArgs()
                    {
                        Session = pitwallSession,
                        SessionDataProvider = chkSessionData.IsChecked == true,
                        TelemetryDataProvider = chkTelemetryData.IsChecked == true
                    });

                    NavigationService.Navigate(pitwallSessionPage);
                }
            }
            catch
            {
                lblJoinSessionError.Visibility = Visibility.Visible;
            }
            finally
            {
                progressIndicator.Visibility = Visibility.Collapsed;
                content.Visibility = Visibility.Visible;
            }

        }

        private void txtSessionId_TextChanged(object sender, TextChangedEventArgs e)
        {
            ValidateSessionConfig();
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.GoBack();
        }
    }
}
