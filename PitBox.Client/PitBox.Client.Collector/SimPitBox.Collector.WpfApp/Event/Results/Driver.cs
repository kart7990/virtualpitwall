using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Event.Results
{
    public class Driver
    {
        public List<Lap> Laps { get; } = new List<Lap>();

        /// <summary>
        /// If true, this is your driver on track.
        /// </summary>
        public bool IsCurrentDriver { get; set; }

        public int Id { get; set; }
        public int CustId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int IRating { get; set; }
        public bool IsSpectator { get; set; }
    }
}
