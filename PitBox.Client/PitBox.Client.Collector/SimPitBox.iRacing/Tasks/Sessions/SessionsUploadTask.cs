using iRacingSdkWrapper;
using iRacingSimulator;
using SimPitBox.iRacing.Tasks.Telemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SimPitBox.Core.Models;
using System.Threading.Tasks;
using SimPitBox.Core.Models.DTOs;
using PitBox.Core.SessionData;
using Microsoft.AspNetCore.SignalR.Client;
using Newtonsoft.Json;

namespace SimPitBox.iRacing.Tasks.Sessions
{
    public class SessionsUploadTask : PitBoxTask
    {
        private readonly HubConnection conenction;

        public SessionsUploadTask(SessionsTask sessionsTask, HubConnection conenction)
        {
            this.conenction = conenction;
            sessionsTask.NewSession += SessionsTask_NewSession;
            sessionsTask.NewEvent += SessionsTask_NewEvent;
            sessionsTask.SessionUpdate += SessionsTask_SessionUpdate;
        }

        private async void SessionsTask_NewEvent(object sender, Event e)
        {
            var session = new PitBox.Core.SessionData.PitBoxSession();
            session.Id = PitBoxEngine.PitBoxSessionId;
            session.EventDetails = new EventDetails();
            session.EventDetails.TrackSessions.Add(MapSessionToTrackSession(e.CurrentSession));
            session.EventDetails.SubSessionId = e.SubSessionId;
            session.EventDetails.CurrentTrackSessionNumber = e.CurrentSession.SessionNumber;

            await conenction.SendAsync("SessionReset", session);
        }

        private async void SessionsTask_SessionUpdate(object sender, Session e)
        {
            //await taskServiceClient.PutTaskData(postPath, e);
        }

        private async void SessionsTask_NewSession(object sender, Session e)
        {
            var trackSession = new TrackSession()
            {
                Flags = e.Flags,
                IsMulticlass = e.IsMulticlass,
                RaceLaps = e.RaceLaps,
                RaceTime = e.RaceTime,
                SessionName = e.SessionName,
                SessionNumber = e.SessionNumber,
                SessionType = e.SessionType,
                Track = new PitBox.Core.SessionData.Track() { CodeName = e.Track.CodeName, Id = e.Track.Id, Length = e.Track.Length, Name = e.Track.Name }
            };
            var message = new PitBoxMessage<TrackSession>() { SessionId = PitBoxEngine.PitBoxSessionId, TeamId = "", SessionElapsedTime = PitBoxEngine.LastUpdateTime, Data = trackSession };
            var json = JsonConvert.SerializeObject(message);
            await conenction.SendAsync("AddTrackSession", message);
        }

        private TrackSession MapSessionToTrackSession(Session session)
        {
            return new TrackSession()
            {
                Flags = session.Flags,
                IsMulticlass = session.IsMulticlass,
                RaceLaps = session.RaceLaps,
                RaceTime = session.RaceTime,
                SessionName = session.SessionName,
                SessionNumber = session.SessionNumber,
                SessionType = session.SessionType,
                PlayerCustId = session.PlayerCustId,
                Track = new PitBox.Core.SessionData.Track()
                {
                    CodeName = session.Track.CodeName,
                    Id = session.Track.Id,
                    Length = session.Track.Length,
                    Name = session.Track.Name
                }
            };
        }
    }
}
