using System.Windows;

namespace Pitwall.Windows.App
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            var version = Environment.GetEnvironmentVariable("ClickOnce_CurrentVersion");

#if DEBUG
            version = "version: debug - api domain: " + App.Config["ApiDomainLocal"] + " - app domain: " + App.Config["WebAppDomainLocal"];
#endif

            lblWelcome.Content = "Welcome App Version: " + version;
        }
    }
}