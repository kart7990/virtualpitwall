"use client";

import { API_BASE_URL, API_V1_URL } from "@/config/urls";
import {
  selectCurrentTrackSessionNumber,
  selectOAuthToken,
  sessionSlice,
  standingsSlice,
  telemetrySlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { LapTelemetry } from "@/lib/redux/slices/sessionSlice/models";
import {
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from "@microsoft/signalr";
import axios from "axios";
import { useEffect, useState } from "react";
import { clearIntervalAsync } from "set-interval-async";
import { setIntervalAsync } from "set-interval-async/dynamic";

let sessionDynamicDataLastResponse = 1;
let standingsDataLastResponse = 1;
let telemetryDataLastResponse = 1;
let _trackSessionNumber: number | undefined = -1;
let _lapsLastUpdate = -1;
let _lapsLastTelemetryLap = -1;
let _isCarTelemetryActive = false;

export default function PitwallSession({
  children,
  pitwallSessionId,
}: {
  children: React.ReactNode;
  pitwallSessionId: string;
}) {
  const dispatch = useDispatch();

  //Page State
  const [isLoading, setLoading] = useState(true);

  //Web-Socket Connections
  const [sessionConnection, setSessionConnection] = useState<HubConnection>();
  const [standingsConnection, setStandingsConnection] =
    useState<HubConnection>();
  const [telemetryConnection, setTelemetryConnection] =
    useState<HubConnection>();
  const [lapsConnection, setLapsConnection] = useState<HubConnection>();

  //Session state
  const [joinSessionLastLapSessionTime, setJoinSessionLastLapSessionTime] =
    useState(-1);
  const [joinSessionLastTelemetryLap, setJoinSessionLastTelemetryLap] =
    useState(-1);
  const trackSessionNumber = useSelector(selectCurrentTrackSessionNumber);
  const oAuthToken = useSelector(selectOAuthToken);
  _trackSessionNumber = trackSessionNumber;

  // #region Session Join Request
  useEffect(() => {
    const joinSession = async () => {
      setLoading(true);
      var joinSessionResponse = await axios.get(
        `${API_V1_URL}/pitbox/session/${pitwallSessionId}`,
      );
      dispatch(sessionSlice.actions.init(joinSessionResponse.data));

      if (joinSessionResponse.data.completedLaps.length > 0) {
        const [lastLap] = joinSessionResponse.data.completedLaps.slice(-1);
        setJoinSessionLastLapSessionTime(lastLap.sessionTimeLapEnd);
      } else {
        setJoinSessionLastLapSessionTime(0);
      }

      if (joinSessionResponse.data.telemetryLaps.length > 0) {
        const [lastLap] = joinSessionResponse.data.telemetryLaps.slice(-1);
        setJoinSessionLastTelemetryLap(lastLap.lapNumber);
      } else {
        setJoinSessionLastTelemetryLap(0);
      }

      const buildHubConnection = (
        socketEndpoint: string,
        sessionId: string,
      ) => {
        const options: IHttpConnectionOptions = {
          accessTokenFactory: () => oAuthToken!!.accessToken,
        };

        return new HubConnectionBuilder()
          .withUrl(
            API_BASE_URL + socketEndpoint + "?sessionId=" + sessionId,
            options,
          )
          .withAutomaticReconnect()
          .build();
      };

      var sessionConnection = buildHubConnection(
        joinSessionResponse.data.webSocketEndpoints.Session,
        joinSessionResponse.data.pitBoxSession.id,
      );
      var standingsConnection = buildHubConnection(
        joinSessionResponse.data.webSocketEndpoints.Standings,
        joinSessionResponse.data.pitBoxSession.id,
      );
      var lapsConnection = buildHubConnection(
        joinSessionResponse.data.webSocketEndpoints.Laps,
        joinSessionResponse.data.pitBoxSession.id,
      );
      var telemetryConnection = buildHubConnection(
        joinSessionResponse.data.webSocketEndpoints.Telemetry,
        joinSessionResponse.data.pitBoxSession.id,
      );

      await sessionConnection.start();
      await standingsConnection.start();
      await lapsConnection.start();
      await telemetryConnection.start();
      setSessionConnection(sessionConnection);
      setStandingsConnection(standingsConnection);
      setLapsConnection(lapsConnection);
      setTelemetryConnection(telemetryConnection);

      setLoading(false);
    };
    joinSession();
  }, [pitwallSessionId, dispatch, oAuthToken]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on("onSessionReset", () => {
          _lapsLastUpdate = 0;
          _lapsLastTelemetryLap = 0;
          dispatch(sessionSlice.actions.reset());
        });
        sessionConnection.on("onTrackSessionChanged", (trackSession) => {
          //TODO: DH - This isn't working
          _lapsLastUpdate = 0;
          _lapsLastTelemetryLap = 0;
          dispatch(sessionSlice.actions.trackSessionChange(trackSession));
        });
        sessionConnection.on(
          "onDynamicSessionDataUpdate",
          (dynamicSessionData) => {
            if (dynamicSessionData?.timing?.simTimeOfDay) {
              var seconds = dynamicSessionData.timing.simTimeOfDay; // Some arbitrary value
              var date = new Date(seconds * 1000); // multiply by 1000 because Date() requires milliseconds
              var timeStr = date.toISOString();
              dynamicSessionData.timing.simTimeOfDay = timeStr;
            }
            _isCarTelemetryActive = dynamicSessionData.isCarTelemetryActive;

            dispatch(
              sessionSlice.actions.trackSessionUpdate(dynamicSessionData),
            );

            sessionDynamicDataLastResponse = Date.now();
          },
        );
      };
      connect();
    }
  }, [sessionConnection, dispatch]);

  useEffect(() => {
    if (sessionConnection) {
      var lastRequest1 = 0;
      const timer = setIntervalAsync(async () => {
        if (sessionDynamicDataLastResponse > lastRequest1) {
          lastRequest1 = Date.now();
          await sessionConnection.invoke("RequestDynamicSessionData", {
            sessionId: pitwallSessionId,
            teamId: "",
          });
        }
      }, 1000);
      async () => await clearIntervalAsync(timer);
    }
  }, [sessionConnection, pitwallSessionId]);

  // #endregion

  // #region Standings WebSocket Connection
  useEffect(() => {
    if (standingsConnection) {
      const connect = async () => {
        standingsConnection.on("onStandingsUpdate", (standings) => {
          dispatch(standingsSlice.actions.update(standings));
          standingsDataLastResponse = Date.now();
        });
      };
      connect();
    }
  }, [standingsConnection, dispatch]);

  useEffect(() => {
    if (standingsConnection) {
      var lastRequest = 0;
      const timer = setIntervalAsync(async () => {
        if (standingsDataLastResponse > lastRequest) {
          lastRequest = Date.now();
          await standingsConnection.invoke("RequestStandings", {
            sessionId: pitwallSessionId,
            teamId: "",
          });
        }
      }, 700);
      async () => await clearIntervalAsync(timer);
    }
  }, [standingsConnection, pitwallSessionId]);

  // #region Telemetry WebSocket Connection
  useEffect(() => {
    if (telemetryConnection) {
      const connect = async () => {
        telemetryConnection.on("onTelemetryUpdate", (message) => {
          dispatch(telemetrySlice.actions.update(message));
          telemetryDataLastResponse = Date.now();
        });
      };
      connect();
    }
  }, [telemetryConnection, dispatch]);

  useEffect(() => {
    if (telemetryConnection /*&& isAvailable*/) {
      var lastRequest = 0;
      const timer = setIntervalAsync(async () => {
        if (_isCarTelemetryActive && telemetryDataLastResponse > lastRequest) {
          lastRequest = Date.now();
          await telemetryConnection.invoke("RequestTelemetry", {
            sessionId: pitwallSessionId,
            teamId: "",
          });
        } else {
          //console.log('Previous telemetry data not received yet, skipping.')
        }
      }, 333);

      async () => await clearIntervalAsync(timer);
    }
  }, [telemetryConnection /*, isAvailable */, pitwallSessionId]);
  // #endregion

  // #region Laps WebSocket Connection
  useEffect(() => {
    const connect = async () => {
      // don't need isActive check, laps are only requested when notified of new laps
      if (lapsConnection && joinSessionLastLapSessionTime > -1) {
        _lapsLastUpdate = joinSessionLastLapSessionTime;
        lapsConnection.on("onLapsUpdate", (message) => {
          console.log("DAVIDHLAPSUPDATE", message);
          _lapsLastUpdate = message.item1;
          if (_trackSessionNumber) {
            dispatch(
              sessionSlice.actions.addLaps({
                sessionNumber: _trackSessionNumber,
                laps: message.item2,
              }),
            );
          }
        });

        lapsConnection.on("onLapsReceived", async () => {
          if (_trackSessionNumber && _trackSessionNumber >= 0) {
            console.log("DAVIDHonLapsReceived", {
              sessionId: pitwallSessionId,
              teamId: "",
              sessionNumber: _trackSessionNumber,
              sessionElapsedTime: _lapsLastUpdate,
            });
            await lapsConnection.invoke("RequestLaps", {
              sessionId: pitwallSessionId,
              teamId: "",
              sessionNumber: _trackSessionNumber,
              sessionElapsedTime: _lapsLastUpdate,
            });
          }
        });
      }
    };
    connect();
  }, [
    lapsConnection,
    joinSessionLastLapSessionTime,
    pitwallSessionId,
    dispatch,
  ]);

  useEffect(() => {
    const connect = async () => {
      if (lapsConnection && joinSessionLastTelemetryLap > -1) {
        _lapsLastTelemetryLap = joinSessionLastTelemetryLap;
        lapsConnection.on("onLapTelemetryUpdate", (lapResponse) => {
          _lapsLastTelemetryLap = lapResponse.reduce(
            (a: LapTelemetry, b: LapTelemetry) =>
              a.lapNumber > b.lapNumber ? a : b,
          ).lapNumber;
          if (_trackSessionNumber) {
            dispatch(
              sessionSlice.actions.addTelemetryLap({
                sessionNumber: _trackSessionNumber,
                laps: lapResponse,
              }),
            );
          }
        });

        lapsConnection.on("onLapTelemetryReceived", async () => {
          if (_trackSessionNumber != null) {
            await lapsConnection.invoke("RequestTelemetryLaps", {
              sessionId: pitwallSessionId,
              teamId: "",
              sessionNumber: _trackSessionNumber,
              lastLapNumber: _lapsLastTelemetryLap,
            });
          }
        });
      }
    };
    connect();
  }, [lapsConnection, joinSessionLastTelemetryLap, pitwallSessionId, dispatch]);
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
