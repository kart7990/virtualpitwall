using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using PitBox.Core.SessionData;
using SimPitBox.Core.Models;
using SimPitBox.iRacing.Services;
using SimPitBox.iRacing.Tasks;
using SimPitBox.iRacing.Tasks.Sessions;
using SimPitBox.iRacing.Tasks.Telemetry;
using SimPitBox.iRacing.Tasks.Telemetry.Lap;
using SimPitBox.iRacing.Tasks.Telemetry.RealTime;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace SimPitBox.iRacing
{
    public class PitBoxEngine
    {
        private const int TELEMETRY_UPLOAD_INTERVAL = 200;
        private const int CONDITIONS_UPLOAD_INTERVAL = 10000;
        //private static string BASE_URL = "http://localhost:7071/";
        private readonly string baseUrl;
        private bool carOnTrack = false;

        //Network
        private readonly PitBoxServiceClient pitBoxServiceClient;
        private readonly TaskServiceClient taskServiceClient;

        //All tasks
        private List<PitBoxTask> pitBoxTasks;

        //Analysis Tasks
        private SessionsTask sessionManagerTask;
        private LapDetectionTask lapDetectionTask;
        private LapTelemetryTask lapTelemetryTask;

        private RealTimeSessionDataTask realTimeSessionDataTask;

        //Uploader Tasks
        private LapTelemetryUploaderTask lapTelemetryUploaderTask;
        private RealTimeTelemetryUploaderTask realTimeTelemetryUploaderTask;
        private SessionsUploadTask sessionsUploadTask;
        private readonly HubConnection sessionConnection;
        private readonly HubConnection standingsConnection;
        private readonly HubConnection lapsConnection;
        private readonly HubConnection telemetryConnection;

        public static double LastUpdateTime { get; private set; } = 0;
        public static string PitBoxSessionId { get; private set; }

        public Event Event { get; private set; }

        public PitBoxEngine(string pitBoxSessionId, string baseUrl = "https://simpitboxtest.azurewebsites.net")
        {
            this.baseUrl = baseUrl;

            //Network Config
            pitBoxServiceClient = new PitBoxServiceClient();
            taskServiceClient = new TaskServiceClient(pitBoxServiceClient);
            PitBoxSessionId = pitBoxSessionId;
        }

        public PitBoxEngine(string pitBoxSessionId, HubConnection sessionConnection, HubConnection standingsConnection, HubConnection lapsConnection, HubConnection telemetryConnection)
        {
            PitBoxSessionId = pitBoxSessionId;
            this.sessionConnection = sessionConnection;
            this.standingsConnection = standingsConnection;
            this.lapsConnection = lapsConnection;
            this.telemetryConnection = telemetryConnection;
        }


        public void Start(int updatesPerSecond)
        {
            Event = new Event();
            //Analysis Tasks
            sessionManagerTask = new SessionsTask(Event);

            ResetTasks();

            //ORDER MATTERS (i.e. lapTelemetry must go before lapDetection)
            pitBoxTasks = new List<PitBoxTask>() { sessionManagerTask, lapTelemetryTask, lapDetectionTask, sessionsUploadTask, lapTelemetryUploaderTask, realTimeTelemetryUploaderTask };

            sessionManagerTask.NewSession += SessionManagerTask_NewSession;
            sessionManagerTask.NewEvent += SessionManagerTask_NewEvent; ;
            sessionsUploadTask = new SessionsUploadTask(sessionManagerTask, sessionConnection);

            Sim.Instance.SessionInfoUpdated += Instance_SessionInfoUpdated;
            Sim.Instance.TelemetryUpdated += Instance_Update;
            Sim.Instance.RaceEvent += Instance_RaceEvent;
            Sim.Instance.Start(updatesPerSecond);

            //taskServiceClient.Enabled = true;
        }


        public void Stop()
        {
            Sim.Instance.SessionInfoUpdated -= Instance_SessionInfoUpdated;
            Sim.Instance.TelemetryUpdated -= Instance_Update;
            Sim.Instance.RaceEvent -= Instance_RaceEvent;
            Sim.Instance.Stop();
        }
        private void SessionManagerTask_NewEvent(object sender, Event e)
        {
            ResetTasks();
        }


        private void SessionManagerTask_NewSession(object sender, Session e)
        {
            ResetTasks();
        }

        private void ResetTasks()
        {
            lapDetectionTask = new LapDetectionTask();
            lapTelemetryTask = new LapTelemetryTask(Event, lapDetectionTask);

            realTimeSessionDataTask = new RealTimeSessionDataTask(Event, sessionConnection, standingsConnection, lapsConnection, 200);

            //Uploader Tasks
            realTimeTelemetryUploaderTask = new RealTimeTelemetryUploaderTask(lapTelemetryTask, telemetryConnection, TELEMETRY_UPLOAD_INTERVAL);
            lapTelemetryUploaderTask = new LapTelemetryUploaderTask(lapTelemetryTask, lapsConnection);
            pitBoxTasks = new List<PitBoxTask>()
            {
                sessionManagerTask,
                lapTelemetryTask,
                lapDetectionTask,
                sessionsUploadTask,
                realTimeSessionDataTask,
                lapTelemetryUploaderTask,
                realTimeTelemetryUploaderTask
            };
        }

        private void Instance_RaceEvent(object sender, Sim.RaceEventArgs e)
        {

        }

        private void Instance_SessionInfoUpdated(object sender, iRacingSdkWrapper.SdkWrapper.SessionInfoUpdatedEventArgs e)
        {
            Log("PitBoxSessionInfo", "Updated");
            var sessionTasks = pitBoxTasks.Where(t => t is ISessionTask);

            foreach (ISessionTask task in sessionTasks)
            {
                task.OnSessionUpdate(Sim.Instance.SessionData);
            }
        }

        private void Instance_Update(object sender, iRacingSdkWrapper.SdkWrapper.TelemetryUpdatedEventArgs e)
        {
            LastUpdateTime = e.UpdateTime;
            var telemetryTasks = pitBoxTasks.Where(t => t is ITelemetryTask);

            foreach (ITelemetryTask task in telemetryTasks)
            {
                if ((!task.TelemetryUpdateRequiresActiveSession || (task.TelemetryUpdateRequiresActiveSession && Event.IsSessionActive))
                    && (!task.RequiresCarOnTrack || (task.RequiresCarOnTrack && e.TelemetryInfo.IsOnTrack.Value)))
                {
                    task.OnTelemetryUpdate(e.TelemetryInfo);
                }
            }
        }

        public void Log(string title, string message)
        {
            Debug.WriteLine("SimPit:" + DateTime.Now + ":" + title + ":" + message);
        }
    }
}
