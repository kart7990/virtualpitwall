using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Event
{
    public class RaceDetails
    {
        public string SessionName { get; set; }
        public double RaceTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public string RaceLaps { get; set; }
        public double EstimatedRaceLaps { get; private set; }
        public int EstimatedWholeRaceLaps { get; private set; }
        public double LeaderLapsRemaining { get; private set; }
        public int LeaderWholeLapsRemaining { get; private set; }



        public void CalculateLapsRemaining(iRacingSimulator.Drivers.Driver leader)
        {
            if (!leader.IsPacecar && leader.CurrentResults != null && leader.CurrentResults.Laps.Any())
            {
                var fastestTime = leader.CurrentResults.FastestLap == -1 ? leader.CurrentResults.Laps.Min(l=>l.Value) : leader.CurrentResults.FastestTime.Value;

                if (RaceLaps == "unlimited")
                {
                    LeaderLapsRemaining = RaceTimeRemaining / TimeSpan.FromMilliseconds(fastestTime).TotalSeconds;
                    LeaderWholeLapsRemaining = Convert.ToInt32(Math.Floor(LeaderLapsRemaining));
                    EstimatedRaceLaps = leader.CurrentResults.LapsComplete + LeaderLapsRemaining;
                    EstimatedWholeRaceLaps = leader.CurrentResults.LapsComplete + Convert.ToInt32(Math.Ceiling(LeaderLapsRemaining));
                }
                else
                {
                    LeaderLapsRemaining = Convert.ToInt32(RaceLaps) - leader.CurrentResults.LapsComplete;
                }
            }

        }
    }
}
