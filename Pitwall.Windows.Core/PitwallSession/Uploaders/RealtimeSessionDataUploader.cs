using iRacingSdkWrapper;
using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.GameData;
using Pitwall.Windows.Core.Models;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    internal class RealtimeSessionDataUploader : IntervalUploader<TelemetryInfo>
    {
        private readonly Models.GameSession gameSession;
        private readonly DataPublisherConnection providerConnection;
        private List<Models.Standing> sessionStandings;
        private Condition conditions;

        public RealtimeSessionDataUploader(Models.GameSession gameSession, DataPublisherConnection providerConnection, int minIntervalMs)
            : base(minIntervalMs)
        {
            this.gameSession = gameSession;
            this.providerConnection = providerConnection;
        }

        public SessionTiming SessionTiming { get; } = new SessionTiming();

        public override bool TelemetryUpdateRequiresActiveSession => true;

        public override bool RequiresCarOnTrack => false;

        public override void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            SessionTiming.RaceTimeRemaining = telemetryInfo.SessionTimeRemain.Value;
            SessionTiming.SimDateTime = ((DateTimeOffset)Sim.Instance.SessionData.SimDate.AddSeconds(telemetryInfo.SessionTimeOfDay.Value)).ToUnixTimeSeconds();
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

            var tasks = new List<Task>() { SendStandings(realTimeSessionData.SessionNumber, sessionStandings), SendSessionData(realTimeSessionData) };

            if (newLapsCompleted.Count > 0)
            {
                tasks.Add(SendLaps(realTimeSessionData.SessionNumber, newLapsCompleted));
            }

            await Task.WhenAll(tasks);
        }

        private async Task SendLaps(int sessionNumber, List<Models.Lap> newLapsCompleted)
        {
            var data = new List<CompletedLap>();

            foreach (var lap in newLapsCompleted)
            {
                data.Add(new CompletedLap()
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
                    TrackSessionNumber = lap.SessionNumber,
                    SessionTimeLapEnd = lap.SessionTimeLapEnd,
                    SessionTimeLapStart = lap.SessionTimeLapStart
                });
            }

            var message = new PitwallProviderMessage<List<CompletedLap>>()
            {
                GameAssignedSessionId = gameSession.SubSessionId.ToString(),
                ProviderId = providerConnection.ProviderId,
                Data = data,
                SessionNumber = sessionNumber,
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                SessionId = PitwallDataEngine.PitwallSesisonId
            };

            //TODO: DH - Use IntervalUploader which confirms data received before sending again
            await providerConnection.Connection.SendAsync("AddLaps", message);
        }

        private async Task SendStandings(int sessionNumber, List<Models.Standing> standings)
        {
            var data = new List<Pitwall.Core.Models.GameData.Standing>();

            foreach (var standing in standings)
            {
                data.Add(new Pitwall.Core.Models.GameData.Standing()
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

            var message = new PitwallMessage<List<Pitwall.Core.Models.GameData.Standing>>()
            {
                Data = data,
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                SessionId = PitwallDataEngine.PitwallSesisonId,
                GameAssignedSessionId = gameSession.SubSessionId.ToString(),
                ProviderId = providerConnection.ProviderId,
                SessionNumber = sessionNumber
            };

            //TODO: DH - Use IntervalUploader which confirms data received before sending again
            await providerConnection.Connection.SendAsync("UpdateStandings", message);
        }

        private async Task SendSessionData(RealTimeSessionData sessionData)
        {
            var data = new DynamicTrackSessionData()
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
                LapsRemaining = sessionData.SessionLapsRemaining,
                SessionState = sessionData.SessionState,
                EstimatedRaceLaps = sessionData.Timing.EstimatedRaceLaps,
                EstimatedWholeRaceLaps = sessionData.Timing.EstimatedWholeRaceLaps,
                LeaderLapsRemaining = sessionData.Timing.LeaderLapsRemaining,
                LeaderWholeLapsRemaining = sessionData.Timing.LeaderWholeLapsRemaining,
                RaceTimeRemaining = sessionData.Timing.RaceTimeRemaining,
                ServerTime = PitwallDataEngine.LastUpdateTime,
                GameDateTime = sessionData.Timing.SimDateTime
            };

            var message = new PitwallProviderMessage<DynamicTrackSessionData>()
            {
                GameAssignedSessionId = gameSession.SubSessionId.ToString(),
                ProviderId = providerConnection.ProviderId,
                SessionNumber = sessionData.SessionNumber,
                Data = data,
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                SessionId = PitwallDataEngine.PitwallSesisonId
            };

            //TODO: DH - Use IntervalUploader which confirms data received before sending again
            await providerConnection.Connection.SendAsync("UpdateTrackSession", message);
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

        private List<Models.Lap> ParseTimingAndScoring(List<iRacingSimulator.Drivers.Driver> drivers, TelemetryInfo telemetryInfo)
        {
            var completedLaps = new List<Models.Lap>();
            var liveStandings = new List<Models.Standing>();
            var isQual = Sim.Instance.SessionData.SessionType.IndexOf("qual", StringComparison.OrdinalIgnoreCase) >= 0;
            var isPrac = Sim.Instance.SessionData.SessionType.IndexOf("prac", StringComparison.OrdinalIgnoreCase) >= 0;

            foreach (var driver in Sim.Instance.Drivers)
            {
                if (!driver.IsPacecar)
                {
                    var liveTiming = driver.Live;

                    //Standings
                    var standing = new Models.Standing()
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
                        LastLaptime = driver.CurrentResults != null ? new LapTime(driver.CurrentResults.LastTime.Value) : LapTime.Empty,
                        BestLaptime = driver.CurrentResults != null ? new LapTime(driver.CurrentResults.FastestTime.Value) : LapTime.Empty,
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
                    var car = gameSession.CurrentSession.Cars.SingleOrDefault(c => c.CarNumberRaw == driver.Car.CarNumberRaw);
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
                        gameSession.CurrentSession.Cars.Add(car);
                    }

                    var driverResults = gameSession.CurrentSession.Drivers.SingleOrDefault(d => d.CustId == driver.CustId);

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
                            car.LastLap = new Models.Lap() { LapNumber = lastLap.LapNumber };
                        }
                        else if (car.LastLap?.LapNumber != lastLap.LapNumber)
                        {
                            var newLap = new Models.Lap()
                            {
                                LapTime = new LapTime(lastLap.Value) { LapNumber = lastLap.LapNumber },
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
                                SessionTimeLapStart = telemetryInfo.SessionTime.Value - lastLap.Value / 1000,
                                InPitLane = driver.PitInfo.InPitLane || driver.PitInfo.LastPitLap + 1 == lastLap.LapNumber,
                                PitStopCount = driver.PitInfo.Pitstops,
                                Session = gameSession.CurrentSession
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

                if (gameSession.CurrentSession.IsTimed)
                {
                    SessionTiming.LeaderLapsRemaining = SessionTiming.RaceTimeRemaining / TimeSpan.FromMilliseconds(fastestTime).TotalSeconds;
                    SessionTiming.LeaderWholeLapsRemaining = Convert.ToInt32(Math.Floor(SessionTiming.LeaderLapsRemaining));

                    SessionTiming.EstimatedRaceLaps = gameSession.CurrentSession.IsRace ? leader.CurrentResults.LapsComplete + SessionTiming.LeaderLapsRemaining : gameSession.CurrentSession.RaceTime / TimeSpan.FromMilliseconds(fastestTime).TotalSeconds;
                    SessionTiming.EstimatedWholeRaceLaps = Convert.ToInt32(Math.Ceiling(SessionTiming.EstimatedRaceLaps));
                }
                else
                {
                    SessionTiming.LeaderLapsRemaining = Convert.ToInt32(gameSession.CurrentSession.RaceLaps) - leader.CurrentResults.LapsComplete;
                }
            }
        }
    }
}
