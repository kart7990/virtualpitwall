using iRacingSdkWrapper;
using iRacingSimulator;
using SimPitBox.iRacing.Tasks.Telemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using SimPitBox.Core.Models;

namespace SimPitBox.iRacing.Tasks.Sessions
{
    public class SessionsTask : PitBoxTask, ITelemetryTask, ISessionTask
    {
        private double sessionTime = -1;
        private SessionStates sessionState = SessionStates.Invalid;
        private readonly Event trackEvent;

        public SessionsTask(Event trackEvent)
        {
            this.trackEvent = trackEvent;
        }

        public event EventHandler<Event> NewEvent;
        public event EventHandler<Session> NewSession;
        public event EventHandler<Session> SessionUpdate;

        public bool TelemetryUpdateRequiresActiveSession => false;
        public bool RequiresCarOnTrack => false;

        public void OnSessionUpdate(SessionData sessionData)
        {
            if (trackEvent.SubSessionId != sessionData.SubsessionId)
            {
                trackEvent.Reset(CreateAndPopulateSession(sessionData));
                OnNewEvent(trackEvent);
            }
            else
            {
                if (!trackEvent.Sessions.Any(s => s.SessionNumber == sessionData.SessionNumber))
                {
                    var session = CreateAndPopulateSession(sessionData);
                    trackEvent.Sessions.Add(session);
                    OnNewSession(session);
                }
                else
                {
                    var session = trackEvent.Sessions.Single(s => s.SessionNumber == sessionData.SessionNumber);
                    session.SessionState = sessionData.State.ToString();
                    session.IsFinished = sessionData.IsFinished;
                    session.RaceTimeRemaining = sessionData.TimeRemaining;
                    OnSessionDetailsUpdate(session);
                }
            }
        }
        private Session CreateAndPopulateSession(SessionData sessionData)
        {
            var session = new Session()
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

            session.Track.Id = sessionData.Track.Id;
            session.Track.CodeName = sessionData.Track.CodeName;
            session.Track.Name = sessionData.Track.Name;
            session.Track.Length = sessionData.Track.Length;

            session.IsMulticlass = session.Cars.Where(c => !c.IsPacecar).GroupBy(c => c.CarClassId).Count() > 1;

            return session;
        }

        public void PopulateSession(List<iRacingSimulator.Drivers.Driver> drivers, Session session)
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
            var session = trackEvent.Sessions.SingleOrDefault(s => s.SessionNumber == currentSessionNumber);
            if (session != null && (trackEvent.CurrentSessionNumber != currentSessionNumber || (trackEvent.CurrentSessionNumber == currentSessionNumber && currentSessionTime < sessionTime)))
            {
                //Replace existing session (only known case is AI racing progressing forward and back in session)
                //Session restart (only known case is AI racing)
                trackEvent.Sessions.Remove(session);
            }

            trackEvent.CurrentSessionNumber = currentSessionNumber;
            sessionState = currentSessionState;
            sessionTime = currentSessionTime;
        }

        protected virtual void OnSessionDetailsUpdate(Session e)
        {
            Log("Session Update", e.SessionName);
            SessionUpdate?.Invoke(this, e);
        }

        protected virtual void OnNewSession(Session e)
        {
            Log("New Session Detected", e.SessionName);
            NewSession?.Invoke(this, e);
        }

        protected virtual void OnNewEvent(Event e)
        {
            Log("New Track Event Detected", e.SubSessionId.ToString());
            NewEvent?.Invoke(this, e);
        }
    }
}
