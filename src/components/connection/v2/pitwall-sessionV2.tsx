"use client";

import { API_BASE_URL, API_V2_URL } from "@/config/urls";
import {
  selectCurrentTrackSessionNumber,
  selectOAuthToken,
  sessionSlice,
  standingsSlice,
  telemetrySlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { OAuthToken } from "@/lib/redux/slices/authSlice/models";
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
let _trackSessionNumber: number | undefined = -1;

const buildHubConnection = (
  oAuthToken: OAuthToken,
  socketEndpoint: string,
  sessionId: string,
  dataProviderId: string | null = null,
) => {
  const options: IHttpConnectionOptions = {
    accessTokenFactory: () => oAuthToken.accessToken,
  };
  var url = API_BASE_URL + socketEndpoint + "?sessionId=" + sessionId;

  if (dataProviderId != null) {
    url = url + "&dataProviderId=" + dataProviderId;
  }

  return new HubConnectionBuilder()
    .withUrl(url, options)
    .withAutomaticReconnect()
    .build();
};

export default function PitwallSessionV2({
  children,
  pitwallSessionId,
}: {
  children: React.ReactNode;
  pitwallSessionId: string;
}) {
  console.log("DAVIDH", axios.interceptors);
  const dispatch = useDispatch();

  //Page State
  const [isLoading, setLoading] = useState(true);

  //Web-Socket Connections
  const [sessionConnection, setSessionConnection] = useState<HubConnection>();
  const [gameDataConnection, setGameDataConnection] = useState<HubConnection>();

  const [gameAssignedSessionId, setGameAssignedSessionId] = useState<string>();
  const [pitwallSession, setPitwallSession] = useState<any>();
  const [providerId, setProviderId] = useState<string>();
  const [trackSessionNumber, setTrackSessionNumber] = useState<number>();

  const oAuthToken = useSelector(selectOAuthToken);

  // #region Session Join Request
  useEffect(() => {
    console.log("DAVIDH", "v2");
    const joinSession = async (oAuthToken: OAuthToken) => {
      setLoading(true);
      var joinSessionResponse = await axios.get(
        `${API_V2_URL}/pitwall/session/${pitwallSessionId}`,
      );
      setPitwallSession(joinSessionResponse.data);
      dispatch(sessionSlice.actions.init(joinSessionResponse.data));

      if (
        joinSessionResponse.data.pitwallSession.gameDataProviders.length > 0
      ) {
        var gameDataProvider =
          joinSessionResponse.data.pitwallSession.gameDataProviders[0];
        setProviderId(gameDataProvider.id);

        if (gameDataProvider.gameAssignedSessionIds.length > 0) {
          var gameAssignedSessionId =
            gameDataProvider.gameAssignedSessionIds[0];
          setGameAssignedSessionId(gameAssignedSessionId);
          var gameDataResponse = await axios.get(
            `${API_V2_URL}/pitwall/session/${pitwallSessionId}/gamedata/${gameDataProvider.id}/gamesessionid/${gameAssignedSessionId}`,
          );
          console.log("gameDataResponse", gameDataResponse.data);
          setTrackSessionNumber(gameDataResponse.data.currentTrackSession);
        }
      }

      var sessionConnection = buildHubConnection(
        oAuthToken,
        joinSessionResponse.data.webSocketEndpoints.v2PitwallSession,
        joinSessionResponse.data.pitwallSession.id,
      );

      await sessionConnection.start();

      setSessionConnection(sessionConnection);

      setLoading(false);
    };
    if (oAuthToken != null) {
      joinSession(oAuthToken);
    }
  }, [pitwallSessionId, dispatch, oAuthToken]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on("onGameDataProvider", () => {
          //dispatch(sessionSlice.actions.reset());
        });
        sessionConnection.on("onTrackSessionChanged", (trackSession) => {
          //dispatch(sessionSlice.actions.trackSessionChange(trackSession));
        });
      };
      connect();
    }
  }, [sessionConnection, dispatch]);

  useEffect(() => {
    const connectToGameSessionData = async (
      pitwallSession: any,
      providerId: string,
      oAuthToken: OAuthToken,
    ) => {
      var gameDataConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2GameDataSubscriber,
        pitwallSession.pitwallSession.id,
        providerId,
      );

      await gameDataConnection.start();

      setGameDataConnection(gameDataConnection);
    };
    if (providerId != null && oAuthToken != null) {
      connectToGameSessionData(pitwallSession, providerId, oAuthToken);
    }
  }, [providerId, pitwallSession, oAuthToken]);

  useEffect(() => {
    const getGameSessionData = async (gameDataConnection: HubConnection) => {
      gameDataConnection.on("NewGameSession", (gameSession) => {
        console.log("NewGameSession", gameSession);
        setGameAssignedSessionId(gameSession.gameAssignedSessionId);
        setTrackSessionNumber(gameSession.currentTrackSession);
      });

      gameDataConnection.on("TrackSessionChanged", (trackSession) => {
        console.log("TrackSessionChanged", trackSession);
        setTrackSessionNumber(trackSession.Number);
      });

      gameDataConnection.on(
        "DynamicTrackSessionDataUpdate",
        (trackSessionData) => {
          console.log("DynamicTrackSessionDataUpdate", trackSessionData);
          sessionDynamicDataLastResponse = Date.now();
        },
      );
    };
    if (gameDataConnection != null) {
      getGameSessionData(gameDataConnection);
    }
  }, [providerId, gameDataConnection]);

  useEffect(() => {
    if (
      gameDataConnection != undefined &&
      providerId != undefined &&
      gameAssignedSessionId != undefined &&
      trackSessionNumber != undefined
    ) {
      var lastRequest1 = 0;
      const timer = setIntervalAsync(async () => {
        if (sessionDynamicDataLastResponse > lastRequest1) {
          lastRequest1 = Date.now();
          await gameDataConnection.invoke("RequestDynamicTrackSessionData", {
            providerId: providerId,
            sessionNumber: trackSessionNumber,
            gameAssignedSessionId: gameAssignedSessionId,
          });
        }
      }, 1000);
      async () => await clearIntervalAsync(timer);
    }
  }, [
    gameDataConnection,
    providerId,
    gameAssignedSessionId,
    trackSessionNumber,
  ]);

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
