using iRacingSdkWrapper;
using iRacingSimulator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.PitBox.RealTime.Car
{
    public class FuelConsumption
    {
        private TelemetryInfo lastTelemetryInfo;
        private int? lapNumber = null;
        private int? totalRacingLaps = null;
        private bool ignoreLap = false;
        private bool firstLap = false;
        private double fuelLevelLapStart;
        private int? driverLapsRemaining;

        public void Calculate(TelemetryInfo telemetryInfo, SessionData sessionData, int? driverLapsRemaining = null, int? totalRacingLaps = null)
        {
            this.driverLapsRemaining = driverLapsRemaining + 1; //Laps remaining is 0 based
            this.totalRacingLaps = totalRacingLaps;
            lastTelemetryInfo = telemetryInfo;

            //initial lap
            if (lapNumber == null)
            {
                lapNumber = telemetryInfo.Lap.Value;
                fuelLevelLapStart = telemetryInfo.FuelLevel.Value;
                ignoreLap = true;
            }


            //Check for lap ignoring
            if (!ignoreLap)
            {
                //Ignore grid lap and lap 1
                if (telemetryInfo.Lap.Value == 0 || telemetryInfo.Lap.Value == 1)
                {
                    ignoreLap = true;
                }

                if (telemetryInfo.CarIdxOnPitRoad.Value[telemetryInfo.PlayerCarIdx.Value])
                {
                    //ignore pitroad laps
                    ignoreLap = true;
                }

                if (false/*sessionData.EventType == "Race" TODO: checking for just green doesn't work && !telemetryInfo.SessionFlags.Value.Contains(iRacingSdkWrapper.Bitfields.SessionFlags.Green)*/)
                {
                    //ignore non green flag laps
                    ignoreLap = true;
                }
            }

            //new lap
            if (telemetryInfo.Lap.Value > lapNumber)
            {
                ConsumptionHistory.Add(new FuelLap() { LapNumber = lapNumber.Value, MinMaxAvgIgnore = ignoreLap || firstLap, Consumed = fuelLevelLapStart - telemetryInfo.FuelLevel.Value });
                ignoreLap = false;
                if (firstLap)
                {
                    firstLap = false;
                }
                fuelLevelLapStart = telemetryInfo.FuelLevel.Value;
                lapNumber = telemetryInfo.Lap.Value;
            }
        }

        public double CurrentLapConsumed
        {
            get
            {
                return Round(fuelLevelLapStart - (lastTelemetryInfo == null ? -1 : lastTelemetryInfo.FuelLevel.Value));
            }
        }

        public double TotalConsumed
        {
            get
            {
                return ConsumptionHistory.Any() ? Round(ConsumptionHistory.Sum(c => c.Consumed)) + CurrentLapConsumed : -1;
            }
        }

        public double TotalRequired
        {
            get
            {
                if (AverageLapConsumed != -1 && totalRacingLaps != null)
                {
                    return AverageLapConsumed * (double)totalRacingLaps;
                }
                else
                {
                    return -1;
                }
            }
        }

        public double LastLapConsumed
        {
            get
            {
                return ConsumptionHistory.Any() ? Round(ConsumptionHistory.Last().Consumed) : -1;
            }
        }

        public double AverageLapConsumed
        {
            get
            {
                if (ConsumptionHistory.Any())
                {
                    var laps = ConsumptionHistory.Where(l => !l.MinMaxAvgIgnore);
                    if (laps.Any())
                    {
                        return Round(laps.Average(c => c.Consumed));
                    }
                }
                return -1;
            }
        }

        public double LapMinConsumed
        {
            get
            {
                if (ConsumptionHistory.Any())
                {
                    var laps = ConsumptionHistory.Where(l => !l.MinMaxAvgIgnore);
                    if (laps.Any())
                    {
                        return Round(laps.Min(c => c.Consumed));
                    }
                }
                return -1;
            }
        }

        public double LapsRemaining
        {
            get
            {
                if (lastTelemetryInfo != null && AverageLapConsumed != -1)
                {
                    return lastTelemetryInfo.FuelLevel.Value / AverageLapConsumed;
                }
                else
                {
                    return -1;
                }
            }
        }

        public double FuelRequiredToFinishTotalBased
        {
            get
            {
                if (TotalRequired != -1 && TotalConsumed != -1)
                {
                    return TotalRequired - (TotalConsumed + lastTelemetryInfo.FuelLevel.Value);
                }
                else
                {
                    return -1;
                }
            }
        }

        public double FuelRequiredToFinishLapsBased
        {
            get
            {
                if (driverLapsRemaining != null && AverageLapConsumed != -1)
                {
                    var lapsRemaining = ((int)driverLapsRemaining) - lastTelemetryInfo.LapDistPct.Value;
                    return Round((lapsRemaining * AverageLapConsumed) - lastTelemetryInfo.FuelLevel.Value);
                }
                else
                {
                    return -1;
                }
            }
        }

        public double LapMaxConsumed
        {
            get
            {
                if (ConsumptionHistory.Any())
                {
                    var laps = ConsumptionHistory.Where(l => !l.MinMaxAvgIgnore);
                    if (laps.Any())
                    {
                        return Round(laps.Max(c => c.Consumed));
                    }
                }
                return -1;
            }
        }

        private static double Round(double num)
        {
            return Math.Round(num, 3);
        }

        [JsonIgnore]
        public List<FuelLap> ConsumptionHistory { get; } = new List<FuelLap>();
    }
}

public class FuelLap
{
    public int LapNumber { get; set; }
    public double Consumed { get; set; }
    public bool MinMaxAvgIgnore { get; set; }
}