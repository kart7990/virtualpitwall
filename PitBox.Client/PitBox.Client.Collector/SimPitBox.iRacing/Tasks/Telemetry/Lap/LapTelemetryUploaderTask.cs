using Newtonsoft.Json;
using SimPitBox.iRacing.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimPitBox.Core.Models;
using Microsoft.AspNetCore.SignalR.Client;
using PitBox.Core.SessionData;

namespace SimPitBox.iRacing.Tasks.Telemetry.Lap
{
    public class LapTelemetryUploaderTask : PitBoxTask
    {
        private readonly HubConnection lapsHubConnection;

        public LapTelemetryUploaderTask(LapTelemetryTask lapTelemetryTask, HubConnection lapsHubConnection)
        {
            this.lapsHubConnection = lapsHubConnection;
            lapTelemetryTask.LapComplete += LapTelemetryTask_LapComplete;
        }

        private async void LapTelemetryTask_LapComplete(object sender, Core.Models.LapTelemetry e)
        {
            var lap = new PitBox.Core.SessionData.LapTelemetry()
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
                StintLapNumber = e.StintLapNumber
            };
            await lapsHubConnection.SendAsync("AddTelemetryLap", new PitBoxMessage<PitBox.Core.SessionData.LapTelemetry>()
            {
                Data = lap,
                SessionNumber = e.SessionNumber,
                SessionElapsedTime = PitBoxEngine.LastUpdateTime,
                SessionId = PitBoxEngine.PitBoxSessionId
            });
        }
    }
}
