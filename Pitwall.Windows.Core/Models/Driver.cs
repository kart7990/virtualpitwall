using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class Driver
    {
        public Driver(Car car)
        {
            Car = car;
        }
        /// <summary>
        /// If true, this is your driver on track.
        /// </summary>
        public bool IsCurrentDriver { get; set; }
        public Car Car { get; }
        public int Id { get; set; }
        public int CustId { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int IRating { get; set; }
        public bool IsOnTrack { get; set; }
        public bool IsSpectator { get; set; }
    }
}
