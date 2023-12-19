using iRacingSimulator;
using iRacingSimulator.Drivers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Timing
{
    public static class Standings
    {
        public static List<Standing> Parse(List<iRacingSimulator.Drivers.Driver> drivers)
        {
            var standings = new List<Standing>();

            foreach (var driver in drivers)
            {
                if (!driver.IsPacecar)
                {
                    var liveDriverStats = driver.Live;
                    var standing = new Standing()
                    {
                        DriverName = liveDriverStats.Driver.Name,
                        TeamName = liveDriverStats.Driver.TeamName,
                        LeaderDelta = liveDriverStats.DeltaToLeader,
                        NextCarDelta = liveDriverStats.DeltaToNext,
                        Position = liveDriverStats.Position,
                        ClassPosition = liveDriverStats.ClassPosition,
                        LastLaptime = liveDriverStats.Driver.CurrentResults?.LastTime,
                        BestLaptime = liveDriverStats.Driver.CurrentResults?.FastestTime,
                        PitStopCount = liveDriverStats.Driver.PitInfo?.Pitstops,
                        StintLapCount = liveDriverStats.Driver.PitInfo?.CurrentStint
                    };
                    if(standing.Position > 0)
                    {
                        standings.Add(standing);
                    }
                }
            }

            return standings;
        }

        public class Standing
        {
            public int Position { get; set; }
            public int ClassPosition { get; set; }
            public string CarNumber { get; set; }
            public string DriverName { get; set; }
            public string TeamName { get; set; }
            public string LeaderDelta { get; set; }
            public string NextCarDelta { get; set; }
            public Laptime LastLaptime { get; set; }
            public Laptime BestLaptime { get; set; }
            public int? PitStopCount { get; set; }
            public int? StintLapCount { get; set; }
        }
    }
}
