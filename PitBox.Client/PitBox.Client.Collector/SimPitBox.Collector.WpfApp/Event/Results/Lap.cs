using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Event.Results
{
    public class Lap
    {
        public Lap() : this(0)
        {
            this.Time = TimeSpan.MaxValue;
        }

        public Lap(int value)
        {
            this.Value = value;
            this.Time = TimeSpan.FromMilliseconds(value);
        }

        public Lap(float seconds)
            : this((int)(seconds * 1000f))
        {
        }

        [JsonIgnore]
        public Session Session { get; set; }
        [JsonIgnore]
        public Car Car { get; set; }
        [JsonIgnore]
        public Driver Driver { get; set; }
        [JsonIgnore]
        public iRacingSimulator.Drivers.Driver DriverRaw { get; set; }


        public int Position { get; set; }
        public int Value { get; set; }
        public TimeSpan Time { get; set; }
        public int LapNumber { get; set; }

        /// <summary>
        /// Formats a positive laptime in mm:sss.fff format. Use 'DiffDisplay' for displaying negative (differences in) laptimes.
        /// </summary>
        public string Display
        {
            get
            {
                if (this.Value <= 0 || this.Time == TimeSpan.MaxValue) return "-:--";
                return DiffDisplay;
            }
        }
        public string DiffDisplay
        {
            get
            {
                bool isNeg = this.Value < 0;
                var time = this.Time;
                if (isNeg) time = this.Time.Negate();

                if (this.Time.Minutes > 0)
                    return string.Format("{0}{1:0}:{2:00}.{3:000}", isNeg ? "-" : "", time.Minutes, time.Seconds, time.Milliseconds);
                return string.Format("{0}{1:00}.{2:000}", isNeg ? "-" : "", time.Seconds, time.Milliseconds);
            }
        }

        public string DisplayShort
        {
            get
            {
                if (this.Value <= 0) return "-:--";

                int precision = 1;
                const int TIMESPAN_SIZE = 7;
                int factor = (int)Math.Pow(10, (TIMESPAN_SIZE - precision));
                var rounded = new TimeSpan(((long)Math.Round((1.0 * this.Time.Ticks / factor)) * factor));

                if (rounded.Minutes > 0)
                {
                    var min = rounded.Minutes;
                    var sec = rounded.TotalSeconds - 60 * min;
                    return string.Format("{0}:{1:00.0}", min, sec);
                }
                else
                {
                    var sec = rounded.TotalSeconds;
                    return string.Format("{0:0.0}", sec);
                }
            }
        }
    }
}
