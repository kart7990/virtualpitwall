using iRacingSdkWrapper;
using iRacingSimulator;
using Pitwall.Windows.Core.Models;
using Pitwall.Windows.Core.PitwallSession;

namespace Pitwall.Windows.Core.Session
{
    internal class GameSessionManager : IConditionalTelemetryTask
    {
        private double sessionTime = -1;
        private SessionStates sessionState = SessionStates.Invalid;
        private readonly GameSession gameSession;

        public GameSessionManager(GameSession gameSession)
        {
            this.gameSession = gameSession;
        }

        public event EventHandler<GameSession> NewGameSession;
        public event EventHandler<TrackSession> NewTrackSession;
        public event EventHandler<TrackSession> TrackSessionUpdate;

        public bool TelemetryUpdateRequiresActiveSession => false;
        public bool RequiresCarOnTrack => false;

        public void OnSessionUpdate(SessionData sessionData)
        {
            if (gameSession.SubSessionId != sessionData.SubsessionId)
            {
                gameSession.Reset(CreateAndPopulateSession(sessionData));
                OnNewEvent(gameSession);
            }
            else
            {
                if (!gameSession.Sessions.Any(s => s.SessionNumber == sessionData.SessionNumber))
                {
                    var session = CreateAndPopulateSession(sessionData);
                    gameSession.Sessions.Add(session);
                    OnNewSession(session);
                }
                else
                {
                    var session = gameSession.Sessions.Single(s => s.SessionNumber == sessionData.SessionNumber);
                    session.SessionState = sessionData.State.ToString();
                    session.IsFinished = sessionData.IsFinished;
                    session.RaceTimeRemaining = sessionData.TimeRemaining;
                    OnSessionDetailsUpdate(session);
                }
            }
        }
        private TrackSession CreateAndPopulateSession(SessionData sessionData)
        {
            var session = new TrackSession()
            {
                SubSessionId = sessionData.SubsessionId,
                SessionNumber = sessionData.SessionNumber,
                SessionName = sessionData.SessionName,
                SessionType = sessionData.SessionType,
                SessionState = sessionData.State.ToString(),
                IsFinished = sessionData.IsFinished,
                RaceTime = sessionData.RaceTime,
                RaceLaps = sessionData.RaceLaps,
                Flags = sessionData.Flags.ToString()
            };
            session.Conditions.TrackUsage = TrackConditions.TrackUsageToString(sessionData.TrackUsage);
            session.PlayerCustId = Sim.Instance.Driver?.CustId;

            PopulateSession(Sim.Instance.Drivers, session);

            session.Player = session.Drivers.SingleOrDefault(d => d.CustId == session.PlayerCustId);
            gameSession.Player = session.Player;

            session.Track.Id = sessionData.Track.Id;
            session.Track.CodeName = sessionData.Track.CodeName;
            session.Track.Name = sessionData.Track.Name;
            session.Track.Length = sessionData.Track.Length;
            session.Track.Sectors.Clear();
            sessionData.Track.Sectors.ForEach(s => session.Track.Sectors.Add(new Models.Sector() { Number = s.Number, StartPercentage = s.StartPercentage }));

            session.IsMulticlass = session.Cars.Where(c => !c.IsPacecar).GroupBy(c => c.CarClassId).Count() > 1;

            return session;
        }

        public void PopulateSession(List<iRacingSimulator.Drivers.Driver> drivers, TrackSession session)
        {
            foreach (var driver in drivers)
            {
                //Results
                //Existing driver/car session results
                var car = session.Cars.SingleOrDefault(c => c.CarNumberRaw == driver.Car.CarNumberRaw);

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
                    session.Cars.Add(car);
                }

                var driverResults = session.Drivers.SingleOrDefault(d => d.CustId == driver.CustId);

                if (driverResults == null)
                {
                    driverResults = new Driver(car)
                    {
                        CustId = driver.CustId,
                        Id = driver.Id,
                        IRating = driver.IRating,
                        Name = driver.Name,
                        ShortName = driver.ShortName,
                        IsCurrentDriver = driver.IsCurrentDriver,
                        IsSpectator = driver.IsSpectator
                    };
                    car.Drivers.Add(driverResults);
                }
            }
        }

        public void OnTelemetryUpdate(TelemetryInfo telemetryInfo)
        {
            CheckForNewSession(telemetryInfo.SessionNum.Value, telemetryInfo.SessionState.Value, telemetryInfo.SessionTime.Value);
        }

        private void CheckForNewSession(int currentSessionNumber, SessionStates currentSessionState, double currentSessionTime)
        {
            //Add session if doesn't exist yet
            var session = gameSession.Sessions.SingleOrDefault(s => s.SessionNumber == currentSessionNumber);
            if (session != null && (gameSession.CurrentSessionNumber != currentSessionNumber || (gameSession.CurrentSessionNumber == currentSessionNumber && currentSessionTime < sessionTime)))
            {
                //Replace existing session (only known case is AI racing progressing forward and back in session)
                //Session restart (only known case is AI racing)
                gameSession.Sessions.Remove(session);
            }

            gameSession.CurrentSessionNumber = currentSessionNumber;
            sessionState = currentSessionState;
            sessionTime = currentSessionTime;
        }

        protected virtual void OnSessionDetailsUpdate(TrackSession e)
        {
            //Log("Session Update", e.SessionName);
            TrackSessionUpdate?.Invoke(this, e);
        }

        protected virtual void OnNewSession(TrackSession e)
        {
            //Log("New Session Detected", e.SessionName);
            NewTrackSession?.Invoke(this, e);
        }

        protected virtual void OnNewEvent(GameSession e)
        {
            //Log("New Track Event Detected", e.SubSessionId.ToString());
            NewGameSession?.Invoke(this, e);
        }
    }
}
