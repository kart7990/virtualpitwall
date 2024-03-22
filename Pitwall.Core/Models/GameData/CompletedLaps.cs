using System;
using System.Collections.Generic;
using System.Text;

namespace Pitwall.Core.Models.GameData
{
    public class CompletedLaps
    {
        public List<CompletedLap> Laps { get; set; } = new List<CompletedLap>();
        /// <summary>
        /// Game time of last lap received, used for incremental updates.
        /// </summary>
        public double LastUpdate { get; set; }

    }
}
