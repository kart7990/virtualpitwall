using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pitwall.Windows.Core.Models
{
    public class LapTime
    {
        public LapTime() : this(0)
        {
            Time = TimeSpan.MaxValue;
        }

        public LapTime(int value)
        {
            Value = value;
            Time = TimeSpan.FromMilliseconds(value);
        }

        public LapTime(float seconds)
            : this((int)(seconds * 1000f))
        {
        }

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
                if (Value <= 0 || Time == TimeSpan.MaxValue) return "-:--";
                return DiffDisplay;
            }
        }

        /// <summary>
        /// Formats a (difference in) laptimes in mm:sss.fff format. Works for negative laptimes too.
        /// </summary>
        public string DiffDisplay
        {
            get
            {
                bool isNeg = Value < 0;
                var time = Time;
                if (isNeg) time = Time.Negate();

                if (Time.Minutes > 0)
                    return string.Format("{0}{1:0}:{2:00}.{3:000}", isNeg ? "-" : "", time.Minutes, time.Seconds, time.Milliseconds);
                return string.Format("{0}{1:00}.{2:000}", isNeg ? "-" : "", time.Seconds, time.Milliseconds);
            }
        }

        public string DisplayShort
        {
            get
            {
                if (Value <= 0) return "-:--";

                int precision = 1;
                const int TIMESPAN_SIZE = 7;
                int factor = (int)Math.Pow(10, TIMESPAN_SIZE - precision);
                var rounded = new TimeSpan((long)Math.Round(1.0 * Time.Ticks / factor) * factor);

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

        public static LapTime Empty
        {
            get
            {
                return new LapTime(0);
            }
        }
    }
}
