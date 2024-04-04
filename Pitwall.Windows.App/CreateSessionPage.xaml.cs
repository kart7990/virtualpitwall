using Newtonsoft.Json;
using Pitwall.Core.Models;
using Pitwall.Windows.App.Auth;
using Pitwall.Windows.App.Config;
using System.Net.Http;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for CreateSessionPage.xaml
    /// </summary>
    public partial class CreateSessionPage : Page
    {
        public CreateSessionPage()
        {
            InitializeComponent();
            txtUserName.Text = "Welcome, " + AuthorizationState.Name;
            chkSessionData.Checked += chkDataProvider_Toggled;
        }

        private void ValidateSessionConfig()
        {
            if (IsDataProviderTypeSelected())
            {
                btnStartSession.IsEnabled = true;
            }
            else
            {
                btnStartSession.IsEnabled = false;
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

        private async void btnStartSession_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                lblStartSessionError.Visibility = Visibility.Collapsed;
                progressIndicator.Visibility = Visibility.Visible;
                content.Visibility = Visibility.Collapsed;

                using (HttpClient apiHttpClient = new HttpClient() { BaseAddress = new Uri(DomainConfiguration.ApiDomain) })
                {
                    apiHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", AuthorizationState.AccessToken);
                    //Create session
                    var response = await apiHttpClient.PostAsync(DomainConfiguration.SESSION_API_PATH, null);

                    var jsonString = await response.Content.ReadAsStringAsync();
                    var pitwallSession = JsonConvert.DeserializeObject<PitwallSession>(jsonString);

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
            catch (Exception ex)
            {
                lblStartSessionError.Visibility = Visibility.Visible;
            }
            finally
            {
                progressIndicator.Visibility = Visibility.Collapsed;
                content.Visibility = Visibility.Visible;
            }
        }

        private void btnCancel_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.GoBack();
        }
    }
}
