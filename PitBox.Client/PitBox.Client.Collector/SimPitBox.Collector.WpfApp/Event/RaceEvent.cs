using iRacingSimulator;
using SimPitBox.Collector.WpfApp.Event.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.Collector.WpfApp.Event
{
    public class RaceEvent
    {
        private readonly Dictionary<string, Session> sessions = new Dictionary<string, Session>();

        public event EventHandler<SessionData> NewSession;
        public event EventHandler<iRacingSimulator.Drivers.Driver> LapComplete;
        public event EventHandler<iRacingSimulator.Drivers.Driver> LeaderLapComplete;

        public void ProcessData(SimRealTimeData simRealTimeData)
        {
            if (simRealTimeData.SessionData.SessionName != null)
            {
                var newLaps = new List<Lap>();
                //Add session if doesn't exist yet
                if (!sessions.ContainsKey(simRealTimeData.SessionData.SessionName))
                {
                    var session = new Session()
                    {
                        SessionName = simRealTimeData.SessionData.SessionName,
                        SessionType = simRealTimeData.SessionData.SessionType
                    };
                    sessions.Add(simRealTimeData.SessionData.SessionName, session);
                    OnNewSession(simRealTimeData.SessionData);
                }

                var sessionResults = sessions[simRealTimeData.SessionData.SessionName];

                foreach (var driver in simRealTimeData.Drivers.ToList())
                {

                    var driverResults = sessionResults.Drivers.SingleOrDefault(d => d.CustId == driver.CustId);

                    if (driverResults == null)
                    {
                        driverResults = new Driver()
                        {
                            CustId = driver.CustId,
                            Id = driver.Id,
                            IRating = driver.IRating,
                            Name = driver.Name,
                            ShortName = driver.ShortName
                        };
                        sessionResults.Drivers.Add(driverResults);
                    }

                    var carResults = sessionResults.Cars.ToList().SingleOrDefault(c => c.CarNumber == driver.CarNumber);

                    if (carResults == null)
                    {
                        carResults = new Car()
                        {
                            CarClassColor = driver.Car.CarClassColor,
                            CarClassId = driver.Car.CarClassId,
                            CarClassRelSpeed = driver.Car.CarClassRelSpeed,
                            CarClassShortName = driver.Car.CarClassShortName,
                            CarId = driver.Car.CarId,
                            CarName = driver.Car.CarName,
                            CarNumber = driver.Car.CarNumber,
                            CarNumberRaw = driver.Car.CarNumberRaw,
                            CarPath = driver.Car.CarPath,
                            CarShortName = driver.Car.CarShortName,
                            TeamName = driver.TeamName,
                            TeamId = driver.TeamId,
                            IsPacecar = driver.IsPacecar
                        };
                        sessionResults.Cars.Add(carResults);
                    }

                    if (driver.CurrentResults != null && driver.CurrentResults.Laps != null)
                    {
                        foreach (var lap in driver.CurrentResults.Laps.ToList())
                        {
                            if (!carResults.Laps.Any(l => l.LapNumber == lap.LapNumber))
                            {
                                var newLap = new Lap(lap.Value)
                                {
                                    Position = driver.CurrentResults.Position,
                                    Car = carResults,
                                    Driver = sessionResults.Drivers.Single(d => d.CustId == driver.CustId),
                                    DriverRaw = driver,
                                    LapNumber = lap.LapNumber,
                                    Session = sessionResults
                                };
                                driverResults.Laps.Add(newLap);
                                carResults.Laps.Add(newLap);
                                newLaps.Add(newLap);
                            }
                        }
                    }
                }
                foreach (var lap in newLaps)
                {
                    OnLapCompleted(lap.DriverRaw);

                    if (lap.Position == 1)
                    {
                        OnLeaderLapCompleted(lap.DriverRaw);
                    }
                }
                foreach (var driver in simRealTimeData.Drivers.ToList())
                {
                    var driverResults = sessionResults.Drivers.SingleOrDefault(d => d.CustId == driver.CustId);

                    if (driverResults == null)
                    {
                        driverResults = new Driver()
                        {
                            CustId = driver.CustId,
                            Id = driver.Id,
                            IRating = driver.IRating,
                            Name = driver.Name,
                            ShortName = driver.ShortName
                        };
                        sessionResults.Drivers.Add(driverResults);
                    }

                    var carResults = sessionResults.Cars.ToList().SingleOrDefault(c => c.CarNumber == driver.CarNumber);

                    if (carResults == null)
                    {
                        carResults = new Car()
                        {
                            CarClassColor = driver.Car.CarClassColor,
                            CarClassId = driver.Car.CarClassId,
                            CarClassRelSpeed = driver.Car.CarClassRelSpeed,
                            CarClassShortName = driver.Car.CarClassShortName,
                            CarId = driver.Car.CarId,
                            CarName = driver.Car.CarName,
                            CarNumber = driver.Car.CarNumber,
                            CarNumberRaw = driver.Car.CarNumberRaw,
                            CarPath = driver.Car.CarPath,
                            CarShortName = driver.Car.CarShortName,
                            TeamName = driver.TeamName,
                            TeamId = driver.TeamId,
                            IsPacecar = driver.IsPacecar
                        };
                        sessionResults.Cars.Add(carResults);
                    }

                    if (driver.CurrentResults != null && driver.CurrentResults.Laps != null)
                    {
                        foreach (var lap in driver.CurrentResults.Laps.ToList())
                        {
                            if (!carResults.Laps.Any(l => l.LapNumber == lap.LapNumber))
                            {
                                var newLap = new Lap(lap.Value)
                                {
                                    Position = driver.CurrentResults.Position,
                                    Car = carResults,
                                    Driver = sessionResults.Drivers.Single(d => d.CustId == driver.CustId),
                                    DriverRaw = driver,
                                    LapNumber = lap.LapNumber,
                                    Session = sessionResults
                                };
                                driverResults.Laps.Add(newLap);
                                carResults.Laps.Add(newLap);
                                newLaps.Add(newLap);
                            }
                        }
                    }
                }
                foreach (var lap in newLaps)
                {
                    OnLapCompleted(lap.DriverRaw);

                    if (lap.Position == 1)
                    {
                        OnLeaderLapCompleted(lap.DriverRaw);
                    }
                }
            }
        }

        protected virtual void OnNewSession(SessionData e)
        {
            NewSession?.Invoke(this, e);
        }

        protected virtual void OnLapCompleted(iRacingSimulator.Drivers.Driver e)
        {
            LapComplete?.Invoke(this, e);
        }

        protected virtual void OnLeaderLapCompleted(iRacingSimulator.Drivers.Driver e)
        {
            LeaderLapComplete?.Invoke(this, e);
        }
    }
}
