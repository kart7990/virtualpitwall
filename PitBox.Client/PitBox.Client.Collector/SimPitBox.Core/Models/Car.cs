using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Core.Models
{
    public class Car
    {
        public Lap LastLap { get; set; }
        [JsonIgnore]
        public List<Driver> Drivers { get; } = new List<Driver>();
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public bool IsPacecar { get; set; }
        public string CarNumber { get; set; }
        public int CarNumberRaw { get; set; }
        public int CarId { get; set; }
        public string CarName { get; set; }
        public int CarClassId { get; set; }
        public int CarClassRelSpeed { get; set; }
        public string CarClassShortName { get; set; }
        /// <summary>
        /// Gets the short screen name for this car (e.g. "MX-5 Cup")
        /// </summary>
        public string CarShortName { get; set; }
    }
}
