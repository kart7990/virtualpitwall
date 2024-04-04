using Microsoft.AspNetCore.SignalR.Client;
using Pitwall.Core.Models.DataTransfer;
using Pitwall.Core.Models.Telemetry;

namespace Pitwall.Windows.Core.PitwallSession.Uploaders
{
    internal class CompletedLapTelemetryUploader
    {
        private readonly DataPublisherConnection publisherConnection;

        public CompletedLapTelemetryUploader(LapTelemetryManager lapTelemetryManager, DataPublisherConnection publisherConnection)
        {
            lapTelemetryManager.LapComplete += LapTelemetryTask_LapComplete;
            this.publisherConnection = publisherConnection;
        }

        private async void LapTelemetryTask_LapComplete(object sender, Core.Models.LapTelemetry e)
        {
            var lap = new CompletedLapDetails()
            {
                FuelLapEnd = e.FuelLapEnd,
                FuelLapStart = e.FuelLapStart,
                GreenFlagFullLap = e.GreenFlagFullLap,
                IncidentCountLapEnd = e.IncidentCountLapEnd,
                IncidentCountLapStart = e.IncidentCountLapStart,
                InPitLane = e.InPitLane,
                LapNumber = e.LapNumber,
                MaxRpm = e.MaxRpm,
                MaxSpeed = e.MaxSpeed,
                MinRpm = e.MinRpm,
                MinSpeed = e.MinSpeed,
                RaceTimeRemaining = e.RaceTimeRemaining,
                SessionNumber = e.SessionNumber,
                StintLapNumber = e.StintLapNumber,
            };

            if (e != null && e.LapTime != null)
            {
                lap.LapTime = new LapTime(e.LapTime.Value);
            }

            await publisherConnection.Connection.SendAsync("AddTelemetryLap", new PitwallMessage<CompletedLapDetails>()
            {
                Data = lap,
                SessionNumber = e.SessionNumber,
                SessionElapsedTime = PitwallDataEngine.LastUpdateTime,
                SessionId = PitwallDataEngine.PitwallSesisonId,
                ProviderId = publisherConnection.ProviderId,
                GameAssignedSessionId = e.GameAssignedSessionId
            });
        }
    }
}
