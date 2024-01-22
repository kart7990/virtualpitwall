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
  pitwallSessionSlice,
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
} from "@/lib/redux/slices/pitwallSessionSlice/models";
import {
  HubConnection,
  HubConnectionBuilder,
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
  const [sessionConnection, setSessionConnection] = useState<HubConnection>();
  const [gameDataConnection, setGameDataConnection] = useState<HubConnection>();

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
      dispatch(pitwallSessionSlice.actions.init(joinSessionResponse.data));
      setLoading(false);
    };
    connectToSession();
  }, [pitwallSessionId, dispatch]);

  useEffect(() => {
    const connectToSession = async (sessionHubConnection: HubConnection) => {
      await sessionHubConnection.start();
      setSessionConnection(sessionHubConnection);
    };

    if (pitwallSession != null && oAuthToken != null) {
      const sessionHubConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2PitwallSession,
        pitwallSession.id,
      );
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
      oAuthToken: OAuthToken,
    ) => {
      if (selectedIRacingSessionId != null) {
        var gameDataResponse = await axios.get(
          `${API_V2_URL}/pitwall/session/${selectedDataProvider.pitwallSessionId}/gamedata/${selectedDataProvider.id}/gamesessionid/${selectedIRacingSessionId}`,
        );

        dispatch(
          pitwallSessionSlice.actions.setGameSession(gameDataResponse.data),
        );
      }

      if (gameDataConnection == null) {
        var dataConnection = buildHubConnection(
          oAuthToken,
          pitwallSession.webSocketEndpoints.v2GameDataSubscriber,
          selectedDataProvider.pitwallSessionId,
          selectedDataProvider.id,
        );

        await dataConnection.start();
        //TODO: disconnect on unmount
        setGameDataConnection(dataConnection);
      }

      setLoading(false);
    };
    if (
      pitwallSession != null &&
      selectedDataProvider != null &&
      oAuthToken != null
    ) {
      connectToGameData(
        pitwallSession,
        selectedDataProvider,
        selectedIRacingSessionId,
        oAuthToken,
      );
    }

    return () => {
      if (gameDataConnection != null) {
        gameDataConnection.stop();
      }
    };
  }, [selectedDataProvider, selectedIRacingSessionId, oAuthToken, dispatch]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on(
          "GameDataProviderConnected",
          (gameDataProvider: BaseGameDataProvider) => {
            dispatch(
              pitwallSessionSlice.actions.addGameDataProvider(gameDataProvider),
            );
            toast({
              description: `New data source available from ${gameDataProvider.name}.`,
            });
          },
        );
        sessionConnection.on("GameDataProviderDisconnected", () => {
          //TODO
        });
      };
      connect();
    }
  }, [sessionConnection, dispatch]);

  useEffect(() => {
    const getGameSessionData = async (gameDataConnection: HubConnection) => {
      gameDataConnection.on(
        "NewGameSession",
        async (gameSession: BaseGameSession) => {
          dispatch(pitwallSessionSlice.actions.newGameSession(gameSession));
        },
      );

      gameDataConnection.on(
        "TrackSessionChanged",
        (trackSession: BaseTrackSession) => {
          dispatch(
            pitwallSessionSlice.actions.changeTrackSession(trackSession),
          );
        },
      );

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
      currentTrackSessionNumber != undefined &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null
    ) {
      var lastRequest1 = 0;
      if (dynamicDataRequestTimer.current != null) {
        clearInterval(dynamicDataRequestTimer.current);
      }
      dynamicDataRequestTimer.current = setInterval(async () => {
        if (sessionDynamicDataLastResponse > lastRequest1) {
          lastRequest1 = Date.now();
          await gameDataConnection.invoke("RequestDynamicTrackSessionData", {
            providerId: selectedDataProvider.id,
            sessionNumber: currentTrackSessionNumber,
            gameAssignedSessionId: selectedIRacingSessionId,
          });
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
