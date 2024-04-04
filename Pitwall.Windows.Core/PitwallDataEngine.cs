using iRacingSdkWrapper;
using iRacingSimulator;
using Microsoft.AspNetCore.SignalR.Client;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.Telemetry;
using Pitwall.Windows.Core.Models;
using Pitwall.Windows.Core.PitwallSession;
using Pitwall.Windows.Core.PitwallSession.Uploaders;
using Pitwall.Windows.Core.Session;
using System.Diagnostics;

namespace Pitwall.Windows.Core
{
    public class PitwallDataEngine
    {
        private const int TELEMETRY_UPLOAD_INTERVAL = 200;

        private readonly DataPublisherConnection gameDataProviderConnection;
        private readonly DataPublisherConnection telemetryProviderConnection;

        public static double LastUpdateTime { get; private set; } = 0;
        public static string PitwallSesisonId { get; private set; }

        private GameSession gameSession { get; set; }

        //Managers
        private GameSessionManager gameSessionManager;
        private LapDetectionManager lapDetectionManager;
        private LapTelemetryManager lapTelemetryManager;

        //Uploaders
        private GameSessionDataUploader gameSessionDataUploader;
        private RealtimeSessionDataUploader realtimeSessionDataUploader;
        private CompletedLapTelemetryUploader completedLapTelemetryUploader;
        private TelemetryUploader telemetryUploader;

        private bool CarOnTrack = false;

        public PitwallDataEngine(string pitwallSesisonId, DataPublisherConnection gameDataPublisherConnection = null, DataPublisherConnection telemetryDataPublisherConnection = null)
        {
            if (gameDataPublisherConnection == null && telemetryDataPublisherConnection == null)
            {
                throw new ArgumentNullException("gameDataConnection and telemetryConnection both null");
            }

            PitwallSesisonId = pitwallSesisonId;
            this.gameDataProviderConnection = gameDataPublisherConnection;
            this.telemetryProviderConnection = telemetryDataPublisherConnection;
        }

        public void Start(int updatesPerSecond)
        {
            Sim.Instance.Connected += Instance_Connected;
            Sim.Instance.SessionInfoUpdated += Instance_SessionInfoUpdated;
            Sim.Instance.TelemetryUpdated += Instance_Update;
            Sim.Instance.RaceEvent += Instance_RaceEvent;
            Sim.Instance.Start(updatesPerSecond);
        }

        public void Stop()
        {
            Sim.Instance.Connected -= Instance_Connected;
            Sim.Instance.SessionInfoUpdated -= Instance_SessionInfoUpdated;
            Sim.Instance.TelemetryUpdated -= Instance_Update;
            Sim.Instance.RaceEvent -= Instance_RaceEvent;
            Sim.Instance.Stop();
        }

        private void Instance_Connected(object sender, EventArgs e)
        {
            gameSession = new GameSession();

            gameSessionManager = new GameSessionManager(gameSession);

            gameSessionManager.NewGameSession += SessionManagerTask_NewEvent;
            gameSessionManager.NewTrackSession += SessionManagerTask_NewSession;
            if (gameDataProviderConnection != null)
            {
                gameSessionDataUploader = new GameSessionDataUploader(gameSessionManager, PitwallSesisonId, gameDataProviderConnection);
            }
        }

        private void SessionManagerTask_NewEvent(object sender, GameSession e)
        {
            ResetTasks();
        }

        private void SessionManagerTask_NewSession(object sender, TrackSession e)
        {
            ResetTasks();
        }

        private void ResetTasks()
        {
            lapDetectionManager = new LapDetectionManager();
            lapTelemetryManager = new LapTelemetryManager(gameSession, lapDetectionManager);

            if (gameDataProviderConnection != null)
            {
                realtimeSessionDataUploader = new RealtimeSessionDataUploader(gameSession, gameDataProviderConnection, 200);
            }

            //Uploader Tasks
            if (telemetryProviderConnection != null)
            {
                telemetryUploader = new TelemetryUploader(lapTelemetryManager, telemetryProviderConnection, TELEMETRY_UPLOAD_INTERVAL);
                completedLapTelemetryUploader = new CompletedLapTelemetryUploader(lapTelemetryManager, telemetryProviderConnection);
            }
        }

        private void Instance_RaceEvent(object sender, Sim.RaceEventArgs e)
        {

        }

        private void Instance_SessionInfoUpdated(object sender, SdkWrapper.SessionInfoUpdatedEventArgs e)
        {
            gameSessionManager.OnSessionUpdate(Sim.Instance.SessionData);
        }

        private void Instance_Update(object sender, SdkWrapper.TelemetryUpdatedEventArgs e)
        {
            LastUpdateTime = e.UpdateTime;

            if (!CarOnTrack && e.TelemetryInfo.IsOnTrack.Value)
            {
                if (gameSession.Player != null)
                {
                    CarOnTrack = true;
                    UpdateTelemetryProvider(gameSession.Player, true);
                }
            }
            else if (CarOnTrack && !e.TelemetryInfo.IsOnTrack.Value)
            {
                if (gameSession.Player != null)
                {
                    CarOnTrack = false;
                    UpdateTelemetryProvider(gameSession.Player, false);
                }
            }

            foreach (IConditionalTelemetryTask task in new List<IConditionalTelemetryTask> { lapDetectionManager, lapTelemetryManager, telemetryUploader, realtimeSessionDataUploader, gameSessionManager })
            {
                if (task != null)
                {
                    if ((!task.TelemetryUpdateRequiresActiveSession || (task.TelemetryUpdateRequiresActiveSession && gameSession.IsSessionActive))
                    && (!task.RequiresCarOnTrack || (task.RequiresCarOnTrack && e.TelemetryInfo.IsOnTrack.Value)))
                    {
                        task.OnTelemetryUpdate(e.TelemetryInfo);
                    }
                }
            }
        }

        private async void UpdateTelemetryProvider(Driver player, bool isOnTrack)
        {
            await telemetryProviderConnection.Connection.SendAsync("UpdateTelemetryProvider", new PitwallMessage<BaseTelemetryProvider>()
            {
                Data = new BaseTelemetryProvider()
                {
                    CarNumber = player.Car.CarNumber,
                    GameUserId = player.CustId.ToString(),
                    GameUserName = player.Name,
                    IsOnTrack = isOnTrack
                },
                SessionNumber = gameSession.CurrentSessionNumber,
                SessionElapsedTime = LastUpdateTime,
                SessionId = PitwallSesisonId,
                ProviderId = telemetryProviderConnection.ProviderId,
                GameAssignedSessionId = gameSession.SubSessionId.ToString()
            });
        }

        public void ConsoleLog(string title, string message)
        {
            Debug.WriteLine("VirtualPitwall:" + DateTime.Now + ":" + title + ":" + message);
        }
    }
}
