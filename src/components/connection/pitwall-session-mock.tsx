"use client";

import onDynamicSessionDataUpdate from "../../../mock-data/single-class-timed/onDynamicSessionDataUpdate-racing.json";
import onStandingsUpdate from "./../../../mock-data/single-class-timed/onStandingsUpdate-1.json";
import pitboxSessionData from "./../../../mock-data/single-class-timed/pitbox-session.json";
import {
  selectOAuthToken,
  sessionSlice,
  standingsSlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { useEffect, useState } from "react";

export default function PitwallSessionMock({
  children,
  pitwallSessionId,
}: {
  children: React.ReactNode;
  pitwallSessionId: string;
}) {
  const dispatch = useDispatch();

  //Page State
  const [isLoading, setLoading] = useState(true);

  //Session state
  const [, setJoinSessionLastLapSessionTime] = useState(-1);
  const [, setJoinSessionLastTelemetryLap] = useState(-1);
  const oAuthToken = useSelector(selectOAuthToken);

  // #region Session Join Request
  useEffect(() => {
    const joinSession = async () => {
      setLoading(true);

      const sessionData = JSON.parse(JSON.stringify(pitboxSessionData));
      dispatch(sessionSlice.actions.init(sessionData.data));

      if (pitboxSessionData.data.completedLaps.length > 0) {
        const [lastLap] = pitboxSessionData.data.completedLaps.slice(-1);
        setJoinSessionLastLapSessionTime(lastLap.sessionTimeLapEnd);
      } else {
        setJoinSessionLastLapSessionTime(0);
      }

      if (sessionData.data.telemetryLaps.length > 0) {
        const [lastLap] = sessionData.data.telemetryLaps.slice(-1);
        setJoinSessionLastTelemetryLap(lastLap.lapNumber);
      } else {
        setJoinSessionLastTelemetryLap(0);
      }

      setLoading(false);
    };
    joinSession();
  }, [pitwallSessionId, dispatch, oAuthToken]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    const dynamicSessionData = JSON.parse(
      JSON.stringify(onDynamicSessionDataUpdate),
    );
    dispatch(sessionSlice.actions.trackSessionUpdate(dynamicSessionData));
  });
  //     if (sessionConnection) {
  //       const connect = async () => {
  //         sessionConnection.on("onSessionReset", (pitboxSession) => {
  //           _lapsLastUpdate = 0;
  //           _lapsLastTelemetryLap = 0;
  //           dispatch(sessionSlice.actions.reset());
  //         });
  //         sessionConnection.on("onTrackSessionChanged", (trackSession) => {
  //           //TODO: DH - This isn't working
  //           _lapsLastUpdate = 0;
  //           _lapsLastTelemetryLap = 0;
  //           dispatch(sessionSlice.actions.trackSessionChange(trackSession));
  //         });
  //         sessionConnection.on(
  //           "onDynamicSessionDataUpdate",
  //           (dynamicSessionData) => {
  //             if (dynamicSessionData?.timing?.simTimeOfDay) {
  //               var seconds = dynamicSessionData.timing.simTimeOfDay; // Some arbitrary value
  //               var date = new Date(seconds * 1000); // multiply by 1000 because Date() requires milliseconds
  //               var timeStr = date.toISOString();
  //               dynamicSessionData.timing.simTimeOfDay = timeStr;
  //             }
  //             _isCarTelemetryActive = dynamicSessionData.isCarTelemetryActive;

  //             dispatch(
  //               sessionSlice.actions.trackSessionUpdate(dynamicSessionData),
  //             );

  //             sessionDynamicDataLastResponse = Date.now();
  //           },
  //         );
  //       };
  //       connect();
  //     }
  //   }, [sessionConnection, dispatch]);

  //   useEffect(() => {
  //     if (sessionConnection) {
  //       var lastRequest1 = 0;
  //       const timer = setIntervalAsync(async () => {
  //         if (sessionDynamicDataLastResponse > lastRequest1) {
  //           lastRequest1 = Date.now();
  //           await sessionConnection.invoke("RequestDynamicSessionData", {
  //             sessionId: pitwallSessionId,
  //             teamId: "",
  //           });
  //         }
  //       }, 1000);
  //       async () => await clearIntervalAsync(timer);
  //     }
  //   }, [sessionConnection, pitwallSessionId]);

  // #endregion

  //   #region Standings WebSocket Connection
  useEffect(() => {
    const standingsUpdate = JSON.parse(JSON.stringify(onStandingsUpdate));
    dispatch(standingsSlice.actions.update(standingsUpdate));
  });

  // // #region Telemetry WebSocket Connection
  // useEffect(() => {
  //     if (telemetryConnection) {
  //         const connect = async () => {
  //             telemetryConnection.on('onTelemetryUpdate', message => {
  //                 dispatch(telemetrySlice.actions.update(message))
  //                 telemetryDataLastResponse = Date.now()
  //             })
  //         }
  //         connect()
  //     }
  // }, [telemetryConnection, dispatch]);

  // useEffect(() => {
  //     if (telemetryConnection /*&& isAvailable*/) {
  //         var lastRequest = 0;
  //         const timer = setIntervalAsync(
  //             async () => {
  //                 if (_isCarTelemetryActive && (telemetryDataLastResponse > lastRequest)) {
  //                     lastRequest = Date.now();
  //                     await telemetryConnection.invoke("RequestTelemetry", { sessionId: pitwallSessionId, teamId: "" });
  //                 }
  //                 else {
  //                     //console.log('Previous telemetry data not received yet, skipping.')
  //                 }
  //             },
  //             333)

  //         async () => await clearIntervalAsync(timer);
  //     }
  // }, [telemetryConnection /*, isAvailable */, pitwallSessionId]);
  // // #endregion

  // // #region Laps WebSocket Connection
  // useEffect(() => {
  //     const connect = async () => {
  //         // don't need isActive check, laps are only requested when notified of new laps
  //         if (lapsConnection && joinSessionLastLapSessionTime > -1) {
  //             _lapsLastUpdate = joinSessionLastLapSessionTime;
  //             lapsConnection.on('onLapsUpdate', message => {
  //                 console.log("DAVIDHLAPSUPDATE", message)
  //                 _lapsLastUpdate = message.item1
  //                 if (_trackSessionNumber) {
  //                     dispatch(sessionSlice.actions.addLaps({ sessionNumber: _trackSessionNumber, laps: message.item2 }))
  //                 }
  //             })

  //             lapsConnection.on('onLapsReceived', async () => {
  //                 if (_trackSessionNumber && _trackSessionNumber >= 0) {
  //                     console.log("DAVIDHonLapsReceived", { sessionId: pitwallSessionId, teamId: "", sessionNumber: _trackSessionNumber, sessionElapsedTime: _lapsLastUpdate })
  //                     await lapsConnection.invoke("RequestLaps", { sessionId: pitwallSessionId, teamId: "", sessionNumber: _trackSessionNumber, sessionElapsedTime: _lapsLastUpdate });
  //                 }
  //             })
  //         }
  //     }
  //     connect()
  // }, [lapsConnection, joinSessionLastLapSessionTime, pitwallSessionId, dispatch]);

  // useEffect(() => {
  //     const connect = async () => {
  //         if (lapsConnection && joinSessionLastTelemetryLap > -1) {
  //             _lapsLastTelemetryLap = joinSessionLastTelemetryLap;
  //             lapsConnection.on('onLapTelemetryUpdate', lapResponse => {
  //                 _lapsLastTelemetryLap = lapResponse.reduce((a: LapTelemetry, b: LapTelemetry) => a.lapNumber > b.lapNumber ? a : b).lapNumber;
  //                 if (_trackSessionNumber) {
  //                     dispatch(sessionSlice.actions.addTelemetryLap({ sessionNumber: _trackSessionNumber, laps: lapResponse }))
  //                 }
  //             })

  //             lapsConnection.on('onLapTelemetryReceived', async () => {
  //                 if (_trackSessionNumber != null) {
  //                     await lapsConnection.invoke("RequestTelemetryLaps", { sessionId: pitwallSessionId, teamId: "", sessionNumber: _trackSessionNumber, lastLapNumber: _lapsLastTelemetryLap });
  //                 }
  //             })
  //         }
  //     }
  //     connect()
  // }, [lapsConnection, joinSessionLastTelemetryLap, pitwallSessionId, dispatch]);
  // #endregion

  function LoadingWrapper({ children }: { children: React.ReactNode }) {
    if (isLoading) {
      return <div> loading... </div>;
    } else {
      return children;
    }
  }

  return <>{LoadingWrapper({ children })}</>;
}
