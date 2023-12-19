using iRacingSdkWrapper;
using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;
using PitBox.Core.SessionData;
using SimPitBox.Core.Models;
using SimPitBox.iRacing.Tasks.Sessions;
using SimPitBox.iRacing.Tasks.Telemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing.Tasks
{
    public class RealTimeSessionDataTask : GenericIntervalTask<TelemetryInfo>, ITelemetryTask
    {
        private readonly Event trackEvent;
        private readonly HubConnection sessionHubConnection;
        private readonly HubConnection standingsHubConnection;
        private readonly HubConnection lapsHubConnection;
        private List<Core.Models.Standing> sessionStandings;
        private Condition conditions;

        public RealTimeSessionDataTask(Event trackEvent,
            HubConnection sessionHubConnection,
            HubConnection standingsHubConnection,
            HubConnection lapsHubConnection,
            int minIntervalMs)
            : base(minIntervalMs)
        {
            this.trackEvent = trackEvent;
            this.sessionHubConnection = sessionHubConnection;
            this.standingsHubConnection = standingsHubConnection;
            this.lapsHubConnection = lapsHubConnection;
        }

        public Core.Models.SessionTiming SessionTiming { get; } = new Core.Models.SessionTiming();

        public bool TelemetryUpdateRequiresActiveSession => true;

        public bool RequiresCarOnTrack => false;

        public void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            SessionTiming.RaceTimeRemaining = telemetryInfo.SessionTimeRemain.Value;
            SessionTiming.SimTimeOfDay = telemetryInfo.SessionTimeOfDay.Value;
            RunIfIntervalElapsed(telemetryInfo);
        }

        public override async Task Run(TelemetryInfo telemetryInfo)
        {
            var realTimeSessionData = new RealTimeSessionData();

            var newLapsCompleted = ParseTimingAndScoring(Sim.Instance.Drivers, telemetryInfo);
            ParseConditions(telemetryInfo);

            realTimeSessionData.SessionNumber = telemetryInfo.SessionNum.Value;
            realTimeSessionData.Flags = telemetryInfo.SessionFlags.Value.ToString();
            realTimeSessionData.SessionLapsRemaining = telemetryInfo.SessionLapsRemain.Value;
            realTimeSessionData.SessionState = telemetryInfo.SessionState.Value.ToString();
            realTimeSessionData.IsActive = Sim.Instance.SessionData.State != SessionStates.CoolDown && Sim.Instance.SessionData.State != SessionStates.Invalid;
            realTimeSessionData.IsCarTelemetryActive = telemetryInfo.IsOnTrack.Value;
            realTimeSessionData.Standings = sessionStandings;
            realTimeSessionData.Timing = SessionTiming;
            realTimeSessionData.Conditions = conditions;

            var tasks = new List<Task>() { SendStandings(sessionStandings), SendSessionData(realTimeSessionData) };

            if (newLapsCompleted.Count > 0)
            {
                tasks.Add(SendLaps(realTimeSessionData.SessionNumber, newLapsCompleted));
            }

            await Task.WhenAll(tasks);
        }

        private async Task SendLaps(int sessionNumber, List<Core.Models.Lap> newLapsCompleted)
        {
            var data = new List<PitBox.Core.SessionData.Lap>();

            foreach (var lap in newLapsCompleted)
            {
                data.Add(new PitBox.Core.SessionData.Lap()
                {
                    CarNumber = lap.CarNumber,
                    ClassPosition = lap.ClassPosition,
                    DriverCustId = lap.DriverCustId,
                    DriverName = lap.Driver.Name,
                    InPitLane = lap.InPitLane,
                    LapNumber = lap.LapNumber,
                    LapTime = lap.LapTime.Value,
                    PitStopCount = lap.PitStopCount,
                    Position = lap.Position,
                    RaceTimeRemaining = lap.RaceTimeRemaining,
                    SessionNumber = lap.SessionNumber,
                    SessionTimeLapEnd = lap.SessionTimeLapEnd,
                    SessionTimeLapStart = lap.SessionTimeLapStart
                });
            }

            var message = new PitBoxMessage<List<PitBox.Core.SessionData.Lap>>()
            {
                Data = data,
                SessionNumber = sessionNumber,
                SessionElapsedTime = PitBoxEngine.LastUpdateTime,
                SessionId = PitBoxEngine.PitBoxSessionId
            };

            await lapsHubConnection.SendAsync("AddLaps", message);
        }

        private async Task SendStandings(List<Core.Models.Standing> standings)
        {
            var data = new List<PitBox.Core.SessionData.Standing>();

            foreach (var standing in standings)
            {
                data.Add(new PitBox.Core.SessionData.Standing()
                {
                    BestLaptime = standing.BestLaptime.Value,
                    CarName = standing.CarName,
                    CarNumber = standing.CarNumber,
                    ClassColor = standing.ClassColor,
                    ClassId = standing.ClassId,
                    ClassName = standing.ClassName,
                    ClassPosition = standing.ClassPosition,
                    DriverName = standing.DriverName,
                    DriverShortName = standing.DriverShortName,
                    iRating = standing.iRating,
                    IsCurrentDriver = standing.IsCurrentDriver,
                    Lap = standing.Lap,
                    LapDistancePercent = standing.LapDistancePercent,
                    LastLaptime = standing.LastLaptime.Value,
                    LeaderDelta = standing.LeaderDelta,
                    NextCarDelta = standing.NextCarDelta,
                    PitStopCount = standing.PitStopCount,
                    Position = standing.Position,
                    SR = standing.SR,
                    StandingClassPosition = standing.StandingClassPosition,
                    StandingPosition = standing.StandingPosition,
                    StintLapCount = standing.StintLapCount,
                    TeamName = standing.TeamName

                });
            }

            var message = new PitBoxMessage<List<PitBox.Core.SessionData.Standing>>()
            {
                Data = data,
                SessionElapsedTime = PitBoxEngine.LastUpdateTime,
                SessionId = PitBoxEngine.PitBoxSessionId
            };

            await standingsHubConnection.SendAsync("UpdateStandings", message);
        }

        private async Task SendSessionData(RealTimeSessionData sessionData)
        {
            var data = new DynamicSessionData()
            {
                Conditions = new Conditions()
                {
                    AirDensity = sessionData.Conditions.AirDensity,
                    AirPressure = sessionData.Conditions.AirPressure,
                    AirTemp = sessionData.Conditions.AirTemp,
                    FogLevel = sessionData.Conditions.FogLevel,
                    RelativeHumidity = sessionData.Conditions.RelativeHumidity,
                    Skies = sessionData.Conditions.Skies,
                    TrackTemp = sessionData.Conditions.TrackTemp,
                    TrackUsage = sessionData.Conditions.TrackUsage,
                    WeatherType = sessionData.Conditions.WeatherType,
                    WindDirection = sessionData.Conditions.WindDirection,
                    WindSpeed = sessionData.Conditions.WindSpeed
                },
                Flags = sessionData.Flags,
                IsActive = sessionData.IsActive,
                SessionLapsRemaining = sessionData.SessionLapsRemaining,
                SessionNumber = sessionData.SessionNumber,
                SessionState = sessionData.SessionState,
                IsCarTelemetryActive = sessionData.IsCarTelemetryActive,
                Timing = new PitBox.Core.SessionData.SessionTiming()
                {
                    EstimatedRaceLaps = sessionData.Timing.EstimatedRaceLaps,
                    EstimatedWholeRaceLaps = sessionData.Timing.EstimatedWholeRaceLaps,
                    LeaderLapsRemaining = sessionData.Timing.LeaderLapsRemaining,
                    LeaderWholeLapsRemaining = sessionData.Timing.LeaderWholeLapsRemaining,
                    RaceTimeRemaining = sessionData.Timing.RaceTimeRemaining,
                    SessionTime = PitBoxEngine.LastUpdateTime,
                    SimDate = sessionData.Timing.SimDate,
                    SimTimeOfDay = sessionData.Timing.SimTimeOfDay
                }
            };

            var message = new PitBoxMessage<DynamicSessionData>()
            {
                Data = data,
                SessionElapsedTime = PitBoxEngine.LastUpdateTime,
                SessionId = PitBoxEngine.PitBoxSessionId
            };

            await sessionHubConnection.SendAsync("UpdateDynamicSessionData", message);
        }

        private void ParseConditions(TelemetryInfo telemetryInfo)
        {
            var conditions = new Condition();
            conditions.AirDensity = telemetryInfo.AirDensity.Value;
            conditions.AirPressure = telemetryInfo.AirPressure.Value;
            conditions.AirTemp = telemetryInfo.AirTemp.Value;
            conditions.FogLevel = telemetryInfo.FogLevel.Value;
            conditions.RelativeHumidity = telemetryInfo.RelativeHumidity.Value;
            conditions.Skies = TrackConditions.SkiesFromValue(telemetryInfo.Skies.Value);
            conditions.TrackTemp = telemetryInfo.TrackTemp.Value;
            conditions.WeatherType = telemetryInfo.WeatherType.Value;
            conditions.WindDirection = TrackConditions.WindDirToCardinalAndDegrees(telemetryInfo.WindDir.Value);
            conditions.WindSpeed = telemetryInfo.WindVel.Value;
            this.conditions = conditions;
        }

        private List<Core.Models.Lap> ParseTimingAndScoring(List<iRacingSimulator.Drivers.Driver> drivers, TelemetryInfo telemetryInfo)
        {
            var completedLaps = new List<Core.Models.Lap>();
            var liveStandings = new List<Core.Models.Standing>();
            var isQual = Sim.Instance.SessionData.SessionType.IndexOf("qual", StringComparison.OrdinalIgnoreCase) >= 0;
            var isPrac = Sim.Instance.SessionData.SessionType.IndexOf("prac", StringComparison.OrdinalIgnoreCase) >= 0;

            foreach (var driver in Sim.Instance.Drivers)
            {
                if (!driver.IsPacecar)
                {
                    var liveTiming = driver.Live;

                    //Standings
                    var standing = new Core.Models.Standing()
                    {
                        DriverName = driver.Name,
                        DriverShortName = driver.ShortName == string.Empty ? driver.Name : driver.ShortName,
                        IsCurrentDriver = driver.IsCurrentDriver,
                        TeamName = driver.TeamName,
                        iRating = driver.IRating,
                        //SR = driver.License.Display,
                        LeaderDelta = liveTiming.DeltaToLeader,
                        NextCarDelta = liveTiming.DeltaToNext,
                        LapDistancePercent = liveTiming.LapDistance,
                        Position = liveTiming.Position,
                        CarNumber = driver.Car.CarNumber,
                        ClassPosition = liveTiming.ClassPosition,
                        ClassName = driver.Car.CarClassShortName,
                        ClassId = driver.Car.CarClassId,
                        CarName = driver.Car.CarName,
                        ClassColor = driver.Car.CarClassColorString,
                        LastLaptime = driver.CurrentResults != null ? new Core.Models.LapTime(driver.CurrentResults.LastTime.Value) : Core.Models.LapTime.Empty,
                        BestLaptime = driver.CurrentResults != null ? new Core.Models.LapTime(driver.CurrentResults.FastestTime.Value) : Core.Models.LapTime.Empty,
                        PitStopCount = driver.PitInfo?.Pitstops,
                        Lap = liveTiming.Lap,
                        StintLapCount = driver.PitInfo?.CurrentStint,
                        IsInPitLane = driver.PitInfo != null && (driver.PitInfo.InPitLane || driver.PitInfo.InPitStall),
                        LastPitStopTime = driver.PitInfo?.LastPitLaneTimeSeconds,
                        PitEntryCount = driver.PitInfo?.PitLaneEntries
                    };

                    liveStandings.Add(standing);

                    //Results
                    //Existing driver/car session results
                    var car = trackEvent.CurrentSession.Cars.SingleOrDefault(c => c.CarNumberRaw == driver.Car.CarNumberRaw);
                    if (car == null)
                    {
                        car = new Car()
                        {
                            CarClassId = driver.Car.CarClassId,
                            CarClassRelSpeed = driver.Car.CarClassRelSpeed,
                            CarClassShortName = driver.Car.CarClassShortName,
                            CarId = driver.Car.CarId,
                            CarName = driver.Car.CarName,
                            CarNumber = driver.Car.CarNumber,
                            CarNumberRaw = driver.Car.CarNumberRaw,
                            CarShortName = driver.Car.CarShortName,
                            TeamName = driver.TeamName,
                            TeamId = driver.TeamId,
                            IsPacecar = driver.IsPacecar
                        };
                        trackEvent.CurrentSession.Cars.Add(car);
                    }

                    var driverResults = trackEvent.CurrentSession.Drivers.SingleOrDefault(d => d.CustId == driver.CustId);

                    if (driverResults == null)
                    {
                        driverResults = new Driver(car)
                        {
                            CustId = driver.CustId,
                            Id = driver.Id,
                            IRating = driver.IRating,
                            Name = driver.Name,
                            ShortName = driver.ShortName,
                            IsSpectator = driver.IsSpectator
                        };
                        car.Drivers.Add(driverResults);
                    }

                    driverResults.IsCurrentDriver = driver.IsCurrentDriver;

                    if (driver.CurrentResults != null && driver.CurrentResults.Laps != null && driver.CurrentResults.Laps.Count > 0)
                    {
                        var lastLap = driver.CurrentResults.Laps.Last();

                        if (car.LastLap == null && lastLap.LapNumber > 1)
                        {
                            car.LastLap = new Core.Models.Lap() { LapNumber = lastLap.LapNumber };
                        }
                        else if (car.LastLap?.LapNumber != lastLap.LapNumber)
                        {
                            var newLap = new Core.Models.Lap()
                            {
                                LapTime = new Core.Models.LapTime(lastLap.Value) { LapNumber = lastLap.LapNumber },
                                Position = driver.CurrentResults.Position,
                                ClassPosition = driver.CurrentResults.ClassPosition,
                                Car = car,
                                CarNumber = car.CarNumber,
                                DriverCustId = driver.CustId,
                                SessionNumber = telemetryInfo.SessionNum.Value,
                                Driver = driverResults,
                                LapNumber = lastLap.LapNumber,
                                RaceTimeRemaining = telemetryInfo.SessionTimeRemain.Value,
                                SessionTimeLapEnd = telemetryInfo.SessionTime.Value,
                                SessionTimeLapStart = telemetryInfo.SessionTime.Value - (lastLap.Value / 1000),
                                InPitLane = driver.PitInfo.InPitLane || driver.PitInfo.LastPitLap + 1 == lastLap.LapNumber,
                                PitStopCount = driver.PitInfo.Pitstops,
                                Session = trackEvent.CurrentSession
                            };
                            car.LastLap = newLap;
                            completedLaps.Add(newLap);
                            //OnLapCompleted(newLap);

                            if (newLap.Position == 1)
                            {
                                ParseLapsRemaining(driver);
                                //OnLeaderLapCompleted(newLap);
                            }

                            if (newLap.Driver.IsCurrentDriver)
                            {
                                //await OnPlayerLapCompleted(newLap);
                            }
                        }
                    }
                }
            }


            if (isPrac || isQual)
            {
                var position = 1;
                var classPositions = new Dictionary<int, int>();

                var standingsSortedByTime = liveStandings.Where(s => s.BestLaptime.Value > 0).OrderBy(s => s.BestLaptime.Value);
                var standingsWithNoTime = liveStandings.Where(s => s.BestLaptime.Value <= 0);

                foreach (var standing in standingsSortedByTime)
                {
                    if (!classPositions.ContainsKey(standing.ClassId))
                    {
                        classPositions.Add(standing.ClassId, 1);
                    }

                    standing.StandingPosition = position;
                    standing.StandingClassPosition = classPositions[standing.ClassId];
                    position++;
                    classPositions[standing.ClassId]++;
                }

                foreach (var standing in standingsWithNoTime)
                {
                    if (!classPositions.ContainsKey(standing.ClassId))
                    {
                        classPositions.Add(standing.ClassId, 1);
                    }

                    standing.StandingPosition = position;
                    standing.StandingClassPosition = classPositions[standing.ClassId];
                    position++;
                    classPositions[standing.ClassId]++;
                }
            }

            sessionStandings = liveStandings;

            return completedLaps;
        }

        private void ParseLapsRemaining(iRacingSimulator.Drivers.Driver leader)
        {
            if (!leader.IsPacecar && leader.CurrentResults != null && leader.CurrentResults.Laps.Any())
            {
                var fastestTime = leader.CurrentResults.FastestLap == -1 ? leader.CurrentResults.Laps.Min(l => l.Value) : leader.CurrentResults.FastestTime.Value;

                if (trackEvent.CurrentSession.IsTimed)
                {
                    SessionTiming.LeaderLapsRemaining = SessionTiming.RaceTimeRemaining / TimeSpan.FromMilliseconds(fastestTime).TotalSeconds;
                    SessionTiming.LeaderWholeLapsRemaining = Convert.ToInt32(Math.Floor(SessionTiming.LeaderLapsRemaining));

                    SessionTiming.EstimatedRaceLaps = trackEvent.CurrentSession.IsRace ? leader.CurrentResults.LapsComplete + SessionTiming.LeaderLapsRemaining : trackEvent.CurrentSession.RaceTime / TimeSpan.FromMilliseconds(fastestTime).TotalSeconds;
                    SessionTiming.EstimatedWholeRaceLaps = Convert.ToInt32(Math.Ceiling(SessionTiming.EstimatedRaceLaps));
                }
                else
                {
                    SessionTiming.LeaderLapsRemaining = Convert.ToInt32(trackEvent.CurrentSession.RaceLaps) - leader.CurrentResults.LapsComplete;
                }
            }
        }
    }
}
