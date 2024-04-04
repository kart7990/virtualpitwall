using Pitwall.Core.Models;

namespace Pitwall.Windows.App
{
    public class PitwallSessionNavArgs
    {
        public PitwallSession Session { get; set; }
        public bool SessionDataProvider { get; set; }
        public bool TelemetryDataProvider { get; set; }
    }
}
