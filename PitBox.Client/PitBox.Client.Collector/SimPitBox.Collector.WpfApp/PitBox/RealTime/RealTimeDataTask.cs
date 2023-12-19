using iRacingSimulator;
using iRacingSimulator.Drivers;
using SimPitBox.Collector.WpfApp.Event;
using SimPitBox.Collector.WpfApp.PitBox.RealTime;
using SimPitBox.Collector.WpfApp.PitBox.RealTime.Car;
using SimPitBox.Collector.WpfApp.RealTime;
using SimPitBox.Collector.WpfApp.Timing;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp
{
    public class RealTimeDataTask
    {
        private RaceEvent raceEvent = new RaceEvent();
        private RaceDetails raceDetails = new RaceDetails();
        private FuelConsumption fuelConsumption = new FuelConsumption();
        private IntervalUploader<RealTimeData> intervalUploader;
        //private int lapsRemaining = 8;

        public bool IsOnTrack { get; private set; } = false;
        public bool IsUploading { get { return intervalUploader != null; } }

        public RealTimeDataTask()
        {
            raceEvent.NewSession += RaceEvent_NewSession;
            raceEvent.LeaderLapComplete += RaceEvent_LeaderLapComplete;
            raceEvent.LapComplete += RaceEvent_LapComplete;
        }

        public void StartDataTransport(Uri uploadUrl, int transportIntervalMs = 1000)
        {
            intervalUploader = new IntervalUploader<RealTimeData>(uploadUrl, transportIntervalMs);
        }

        private void RaceEvent_LeaderLapComplete(object sender, iRacingSimulator.Drivers.Driver e)
        {
            raceDetails.CalculateLapsRemaining(e);
        }

        private void RaceEvent_LapComplete(object sender, iRacingSimulator.Drivers.Driver e)
        {

        }

        private void RaceEvent_NewSession(object sender, SessionData e)
        {
            raceDetails = new RaceDetails()
            {
                RaceLaps = e.RaceLaps,
                RaceTime = e.RaceTime,
                SessionName = e.SessionName
            };
        }

        public void StopDataTransport()
        {
            intervalUploader = null;
        }

        public void ProcessData(SimRealTimeData simRealTimeData)
        {
            if (!simRealTimeData.SessionData.IsFinished && !simRealTimeData.SessionData.IsCheckered)
            {
                raceDetails.RaceTimeRemaining = simRealTimeData.SessionData.TimeRemaining;
            }

            raceEvent.ProcessData(simRealTimeData);

            bool isRace = simRealTimeData.SessionData.SessionName == "RACE";

            if (IsOnTrack != simRealTimeData.Telemetry.IsOnTrack.Value)
            {
                //New Stint
                fuelConsumption = new FuelConsumption();
            }

            IsOnTrack = simRealTimeData.Telemetry.IsOnTrack.Value;

            var driver = new Timing.Driver();

            if (simRealTimeData.Driver != null && simRealTimeData.Driver.CurrentResults != null)
            {
                driver.BestLapTime = simRealTimeData.Telemetry.LapBestLapTime.Value;
                driver.LastLapTime = simRealTimeData.Telemetry.LapLastLapTime.Value;
                driver.CurrentLapTime = simRealTimeData.Telemetry.LapCurrentLapTime.Value;
                driver.CurrentLapNumber = simRealTimeData.Telemetry.Lap.Value;
                driver.LapsCompleted = simRealTimeData.Telemetry.LapCompleted.Value;
                driver.DriverLapsRemaining = -1;
                driver.Position = simRealTimeData.Driver.CurrentResults.Position;
                driver.ClassPosition = simRealTimeData.Driver.CurrentResults.ClassPosition;
                driver.LapDeltaToSessionBestLap = simRealTimeData.Telemetry.LapDeltaToSessionBestLap.Value;
                //driver.LapDeltaToSessionLastLap = simRealTimeData.Telemetry.LapDeltaToSessionLastLap.Value;
                driver.Name = simRealTimeData.Driver.Name;
            }

            if (isRace)
            {
                if (simRealTimeData.Driver != null && simRealTimeData.Driver.CurrentResults != null)
                {
                    //if (!simRealTimeData.SessionData.IsFinished && !simRealTimeData.SessionData.IsCheckered)
                    //{
                        driver.DriverLapsComplete = simRealTimeData.Driver.CurrentResults.LapsComplete;
                        if (raceDetails.RaceLaps == "unlimited")
                        {
                            driver.DriverLapsRemaining = (raceDetails.EstimatedWholeRaceLaps - simRealTimeData.Telemetry.Lap.Value);
                        }
                        else
                        {
                            driver.DriverLapsRemaining = (Convert.ToInt32(raceDetails.RaceLaps) - simRealTimeData.Telemetry.Lap.Value);
                        }
                    //}
                }
            }

            if (IsOnTrack)
            {
                //Run telemetry
                fuelConsumption.Calculate(simRealTimeData.Telemetry, simRealTimeData.SessionData, isRace ? driver.DriverLapsRemaining : (int?)null, raceDetails.RaceLaps == "unlimited" ? raceDetails.EstimatedWholeRaceLaps : Convert.ToInt32(raceDetails.RaceLaps));
            }

            var realTimeData = new RealTimeData
            {
                //Car Telemetry
                CarTelemetry = new Telemetry()
                {
                    IsOnTrack = simRealTimeData.Telemetry.IsOnTrack.Value,
                    Speed = Math.Round(simRealTimeData.Telemetry.Speed.Value, 3),
                    RPM = Math.Round(simRealTimeData.Telemetry.RPM.Value),
                    Throttle = Math.Round(simRealTimeData.Telemetry.Throttle.Value * 100),
                    Brake = Math.Round(simRealTimeData.Telemetry.Brake.Value * 100),
                    Clutch = Math.Round(100 - (simRealTimeData.Telemetry.Clutch.Value * 100)),
                    SteeringAngle = Math.Round(simRealTimeData.Telemetry.SteeringWheelAngle.Value),
                    FuelPercent = Math.Round(simRealTimeData.Telemetry.FuelLevelPct.Value, 2),
                    FuelQuantity = Math.Round(simRealTimeData.Telemetry.FuelLevel.Value, 3),
                    FuelPressure = Math.Round(simRealTimeData.Telemetry.FuelPress.Value, 3),
                    OilPressure = Math.Round(simRealTimeData.Telemetry.OilPress.Value, 3),
                    OilTemp = Math.Round(simRealTimeData.Telemetry.OilTemp.Value, 3),
                    WaterTemp = Math.Round(simRealTimeData.Telemetry.WaterTemp.Value, 3),
                    Voltage = Math.Round(simRealTimeData.Telemetry.Voltage.Value, 3),
                    FuelConsumption = fuelConsumption
                },
                Standings = Standings.Parse(simRealTimeData.Drivers),
                Driver = driver,
                RaceDetails = raceDetails
            };

            if (IsUploading)
            {
                intervalUploader.SendIfIntervalElapsed(realTimeData);
            }
        }
    }
}
