"use client";

import { SourceSelection } from "./source-selection";
import { useToast } from "@/components//core/ui/use-toast";
import { API_BASE_URL, API_V2_URL } from "@/config/urls";
import {
  selectOAuthToken,
  getSelectedDataProvider,
  getSelectedIRacingSessionId,
  getPitwallSession,
  getCurrentTrackSessionNumber,
  pitwallSlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { OAuthToken } from "@/lib/redux/slices/authSlice/models";
import {
  BaseGameDataProvider,
  BaseGameSession,
  BaseTrackSession,
  HubEndpoint,
  PitwallSession,
} from "@/lib/redux/slices/pitwallSlice/models";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
} from "@microsoft/signalr";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SetIntervalAsyncTimer, clearIntervalAsync } from "set-interval-async";
import { setIntervalAsync } from "set-interval-async/dynamic";

let sessionDynamicDataLastResponse = 1;
let _trackSessionNumber: number | undefined = -1;

class ReplaceableTimer {
  timer: NodeJS.Timeout | null = null;

  replaceTimer(timer: NodeJS.Timeout) {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
    this.timer = timer;
  }
}

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

export default function PitwallConnection({
  children,
  pitwallSessionId,
}: {
  children: React.ReactNode;
  pitwallSessionId: string;
}) {
  const { toast } = useToast();
  const dispatch = useDispatch();

  //Page State
  const [isLoading, setLoading] = useState(true);

  //WebSocket Connections
  const sessionConnection = useRef<HubConnection>();
  const gameDataConnection = useRef<HubConnection>();

  //Update timers
  const dynamicDataRequestTimer = useRef<NodeJS.Timeout>();

  const oAuthToken = useSelector(selectOAuthToken);
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(getSelectedDataProvider);
  const selectedIRacingSessionId = useSelector(getSelectedIRacingSessionId);
  const currentTrackSessionNumber = useSelector(getCurrentTrackSessionNumber);

  // #region Session Join Request
  useEffect(() => {
    const connectToSession = async () => {
      setLoading(true);
      var joinSessionResponse = await axios.get(
        `${API_V2_URL}/pitwall/session/${pitwallSessionId}`,
      );
      dispatch(pitwallSlice.actions.init(joinSessionResponse.data));
      setLoading(false);
    };
    connectToSession();
  }, [pitwallSessionId, dispatch]);

  useEffect(() => {
    const connectToSession = async (sessionHubConnection: HubConnection) => {
      //If oauth token changes via useEffect dependency, reestablish connection
      await sessionConnection.current?.stop();
      await sessionHubConnection.start();
      sessionConnection.current = sessionHubConnection;
    };

    if (pitwallSession != null && oAuthToken != null) {
      const sessionHubConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2PitwallSession,
        pitwallSession.id,
      );

      sessionHubConnection.on(
        "GameDataProviderConnected",
        (gameDataProvider: BaseGameDataProvider) => {
          dispatch(pitwallSlice.actions.addGameDataProvider(gameDataProvider));
          toast({
            description: `New data source available from user: ${gameDataProvider.name}`,
          });
        },
      );
      sessionHubConnection.on("GameDataProviderDisconnected", () => {
        //TODO
      });

      connectToSession(sessionHubConnection);
      return () => {
        if (sessionHubConnection != null) {
          sessionHubConnection.stop();
        }
      };
    }
  }, [pitwallSession?.id, oAuthToken, dispatch]);

  useEffect(() => {
    const connectToGameData = async (
      pitwallSession: PitwallSession,
      selectedDataProvider: BaseGameDataProvider,
      selectedIRacingSessionId: string | undefined,
      gameDataHubConnection: HubConnection,
    ) => {
      await gameDataConnection.current?.stop();
      if (selectedIRacingSessionId != null) {
        var gameDataResponse = await axios.get(
          `${API_V2_URL}/pitwall/session/${pitwallSession.id}/gamedata/${selectedDataProvider.id}/gamesessionid/${selectedIRacingSessionId}`,
        );

        dispatch(pitwallSlice.actions.setGameSession(gameDataResponse.data));
      }
      await gameDataHubConnection.start();
      gameDataConnection.current = gameDataHubConnection;
    };
    if (
      pitwallSession != null &&
      selectedDataProvider != null &&
      oAuthToken != null
    ) {
      const gameDataHubConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2GameDataSubscriber,
        selectedDataProvider.pitwallSessionId,
        selectedDataProvider.id,
      );

      gameDataHubConnection.on(
        "NewGameSession",
        async (gameSession: BaseGameSession) => {
          dispatch(pitwallSlice.actions.newGameSession(gameSession));
          toast({
            description: `New game session detected. Connected to iRacing server: ${gameSession.gameAssignedSessionId}`,
          });
        },
      );

      gameDataHubConnection.on(
        "TrackSessionChanged",
        (trackSession: BaseTrackSession) => {
          dispatch(pitwallSlice.actions.changeTrackSession(trackSession));
          toast({
            description: `New track session detected: ${trackSession.type}`,
          });
        },
      );

      gameDataHubConnection.on(
        "DynamicTrackSessionDataUpdate",
        (trackSessionData) => {
          dispatch(
            pitwallSlice.actions.setDynamicTrackSessionData(trackSessionData),
          );
          console.log("DynamicTrackSessionDataUpdate", trackSessionData);
          sessionDynamicDataLastResponse = Date.now();
        },
      );

      connectToGameData(
        pitwallSession,
        selectedDataProvider,
        selectedIRacingSessionId,
        gameDataHubConnection,
      );
      return () => {
        if (gameDataHubConnection != null) {
          gameDataHubConnection.stop();
        }
      };
    }
  }, [selectedDataProvider, selectedIRacingSessionId, oAuthToken, dispatch]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (
      gameDataConnection != undefined &&
      currentTrackSessionNumber != undefined &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null
    ) {
      var lastRequest1 = 0;
      if (dynamicDataRequestTimer.current != null) {
        clearInterval(dynamicDataRequestTimer.current);
      }
      dynamicDataRequestTimer.current = setInterval(async () => {
        if (
          sessionDynamicDataLastResponse > lastRequest1 &&
          gameDataConnection.current?.state === HubConnectionState.Connected
        ) {
          lastRequest1 = Date.now();
          await gameDataConnection.current?.invoke(
            "RequestDynamicTrackSessionData",
            {
              providerId: selectedDataProvider.id,
              sessionNumber: currentTrackSessionNumber,
              gameAssignedSessionId: selectedIRacingSessionId,
            },
          );
        }
      }, 1000);
    }
    return () => {
      if (dynamicDataRequestTimer.current != null) {
        clearInterval(dynamicDataRequestTimer.current);
      }
    };
  }, [
    gameDataConnection,
    selectedDataProvider,
    selectedIRacingSessionId,
    currentTrackSessionNumber,
  ]);

  // #endregion

  function LoadingWrapper({ children }: { children: React.ReactNode }) {
    if (isLoading) {
      return <div> loading... </div>;
    } else {
      return (
        <>
          <SourceSelection />
          {children}
        </>
      );
    }
  }

  return <>{LoadingWrapper({ children })}</>;
}
