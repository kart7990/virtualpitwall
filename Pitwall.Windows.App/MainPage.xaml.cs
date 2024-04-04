using Pitwall.Windows.App.Auth;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for MainPage.xaml
    /// </summary>
    public partial class MainPage : Page
    {
        public MainPage()
        {
            InitializeComponent();
            txtUserName.Text = "Welcome, " + AuthorizationState.Name;
        }

        private void StartSession_Click(object sender, RoutedEventArgs e)
        {
            CreateSessionPage createSessionPage = new CreateSessionPage();
            NavigationService.Navigate(createSessionPage);
        }
        private void ShowJoinSessionView_Click(object sender, RoutedEventArgs e)
        {
            JoinSessionPage joinSessionPage = new JoinSessionPage();
            NavigationService.Navigate(joinSessionPage);
        }
    }
}
