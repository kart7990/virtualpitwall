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
            lblWelcome.Content = "Welcome App Version: " + Environment.GetEnvironmentVariable("ClickOnce_CurrentVersion");
        }
    }
}