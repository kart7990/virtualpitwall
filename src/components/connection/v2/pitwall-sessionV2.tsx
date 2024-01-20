"use client";

import { API_BASE_URL, API_V2_URL } from "@/config/urls";
import {
  selectOAuthToken,
  getSelectedDataProvider,
  getSelectedIRacingSessionId,
  getPitwallSession,
  pitwallSessionSlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { OAuthToken } from "@/lib/redux/slices/authSlice/models";
import {
  BaseGameDataProvider,
  HubEndpoint,
  PitwallSession,
} from "@/lib/redux/slices/pitwallSessionSlice/models";
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

  const [trackSessionNumber, setTrackSessionNumber] = useState<number>();

  const oAuthToken = useSelector(selectOAuthToken);
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(getSelectedDataProvider);
  const selectedIRacingSessionId = useSelector(getSelectedIRacingSessionId);

  // #region Session Join Request
  useEffect(() => {
    const connectToSession = async (oAuthToken: OAuthToken) => {
      setLoading(true);
      var joinSessionResponse = await axios.get(
        `${API_V2_URL}/pitwall/session/${pitwallSessionId}`,
      );
      dispatch(pitwallSessionSlice.actions.init(joinSessionResponse.data));
      setLoading(false);
    };
    if (oAuthToken != null) {
      connectToSession(oAuthToken);
    }
  }, [pitwallSessionId, dispatch, oAuthToken]);

  useEffect(() => {
    const connectToSession = async (
      pitwallSession: PitwallSession,
      oAuthToken: OAuthToken,
    ) => {
      console.log("DH SOCK", pitwallSession.webSocketEndpoints);
      var sessionConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2PitwallSession,
        pitwallSession.id,
      );
      await sessionConnection.start();
      setSessionConnection(sessionConnection);
    };
    if (pitwallSession != null && oAuthToken != null) {
      connectToSession(pitwallSession, oAuthToken);
    }
  }, [pitwallSession, oAuthToken, dispatch]);

  useEffect(() => {
    const connectToGameData = async (
      pitwallSession: PitwallSession,
      selectedDataProvider: BaseGameDataProvider,
      selectedIRacingSessionId: string,
      oAuthToken: OAuthToken,
    ) => {
      var gameDataResponse = await axios.get(
        `${API_V2_URL}/pitwall/session/${selectedDataProvider.pitwallSessionId}/gamedata/${selectedDataProvider.id}/gamesessionid/${selectedIRacingSessionId}`,
      );

      if (gameDataConnection != null) {
        await gameDataConnection.stop();
      }

      //dispatch game data

      var dataConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2GameDataSubscriber,
        selectedDataProvider.pitwallSessionId,
        selectedDataProvider.id,
      );

      await dataConnection.start();

      setGameDataConnection(gameDataConnection);

      setTrackSessionNumber(gameDataResponse.data.currentTrackSession);

      setLoading(false);
    };
    if (
      pitwallSession != null &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null &&
      oAuthToken != null
    ) {
      connectToGameData(
        pitwallSession,
        selectedDataProvider,
        selectedIRacingSessionId,
        oAuthToken,
      );
    }
  }, [selectedDataProvider, selectedIRacingSessionId, oAuthToken, dispatch]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on("GameDataProviderConnected", () => {
          //dispatch(sessionSlice.actions.reset());
        });
        sessionConnection.on("GameDataProviderDisconnected", () => {
          //dispatch(sessionSlice.actions.reset());
        });
      };
      connect();
    }
  }, [sessionConnection, dispatch]);

  useEffect(() => {
    const getGameSessionData = async (gameDataConnection: HubConnection) => {
      gameDataConnection.on("NewGameSession", (gameSession) => {
        console.log("NewGameSession", gameSession);
        // dispatch setGameAssignedSessionId(gameSession.gameAssignedSessionId);
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
  }, [gameDataConnection]);

  useEffect(() => {
    if (
      gameDataConnection != undefined &&
      trackSessionNumber != undefined &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null
    ) {
      var lastRequest1 = 0;
      const timer = setIntervalAsync(async () => {
        if (sessionDynamicDataLastResponse > lastRequest1) {
          lastRequest1 = Date.now();
          await gameDataConnection.invoke("RequestDynamicTrackSessionData", {
            providerId: selectedDataProvider.id,
            sessionNumber: trackSessionNumber,
            gameAssignedSessionId: selectedIRacingSessionId,
          });
        }
      }, 1000);
      async () => await clearIntervalAsync(timer);
    }
  }, [
    gameDataConnection,
    selectedDataProvider,
    selectedIRacingSessionId,
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
