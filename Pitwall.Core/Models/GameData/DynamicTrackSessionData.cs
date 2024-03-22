namespace Pitwall.Core.Models.GameData
{
    public class DynamicTrackSessionData
    {
        public string SessionState { get; set; }
        public string Flags { get; set; }
        public int LapsRemaining { get; set; }
        public double ServerTime { get; set; }
        public long GameDateTime { get; set; }
        public double RaceTimeRemaining { get; set; }
        public double EstimatedRaceLaps { get; set; }
        public int EstimatedWholeRaceLaps { get; set; }
        public double LeaderLapsRemaining { get; set; }
        public int LeaderWholeLapsRemaining { get; set; }
        public Conditions Conditions { get; set; }
    }
}
