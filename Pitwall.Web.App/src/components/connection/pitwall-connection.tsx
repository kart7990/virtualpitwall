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
  selectTelemetryProvider,
  selectDataProvider,
  pitwallSlice,
  useDispatch,
  useSelector,
} from "@/lib/redux";
import { OAuthToken } from "@/lib/redux/slices/authSlice/models";
import {
  BaseGameDataProvider,
  BaseGameSession,
  BaseTelemetryProvider,
  BaseTrackSession,
  CompletedLaps,
  CompletedTelemetryLaps,
  GameSession,
  HubEndpoint,
  PitwallSession,
  Telemetry,
} from "@/lib/redux/slices/pitwallSlice/models";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
} from "@microsoft/signalr";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

let sessionDynamicDataLastResponse = 1;
let lapsLastResponse = 1;
let standingsDataLastResponse = 1;
let telemetryDataLastResponse = 1;
let lapsLastUpdateGameTime = 0;
let telemetryLapsLastUpdateGameTime = 0;

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
  const [isDataConnectionStarted, setDataConnectionStarted] = useState(false);
  const [isTelemetryConnectionStarted, setTelemetryConnectionStarted] =
    useState(false);

  //WebSocket Connections
  const sessionConnection = useRef<HubConnection>();
  const gameDataConnection = useRef<HubConnection>();
  const telemetryConnection = useRef<HubConnection>();

  //Update timers
  const dynamicDataRequestTimer = useRef<NodeJS.Timeout>();
  const standingsDataRequestTimer = useRef<NodeJS.Timeout>();
  const telemetryDataRequestTimer = useRef<NodeJS.Timeout>();

  const oAuthToken = useSelector(selectOAuthToken);
  const pitwallSession = useSelector(getPitwallSession);
  const selectedDataProvider = useSelector(selectDataProvider);
  const selectedTelemetryProvider = useSelector(selectTelemetryProvider);
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

      sessionHubConnection.on(
        "TelemetryProviderConnected",
        (telemetryProvider: BaseTelemetryProvider) => {
          dispatch(
            pitwallSlice.actions.addTelemetryProvider(telemetryProvider),
          );
          toast({
            description: `New telemetry source available from user: ${telemetryProvider.name}`,
          });
        },
      );
      sessionHubConnection.on("TelemetryProviderDisconnected", () => {
        //TODO
      });
      connectToSession(sessionHubConnection);
      return () => {
        if (sessionHubConnection != null) {
          sessionHubConnection.stop();
        }
      };
    }
  }, [pitwallSession, oAuthToken, dispatch, toast]);

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
        var gameSession: GameSession = gameDataResponse.data;
        let lastupdate = gameSession.trackSessions.find(
          (ts) => ts.number === gameSession.currentTrackSession,
        )?.completedLaps?.lastUpdate;
        if (lastupdate != null) {
          lapsLastUpdateGameTime = lastupdate;
        }
        dispatch(pitwallSlice.actions.setGameSession(gameDataResponse.data));
      }
      await gameDataHubConnection.start();
      gameDataConnection.current = gameDataHubConnection;
      setDataConnectionStarted(true);
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
          lapsLastUpdateGameTime = 0;
          telemetryLapsLastUpdateGameTime = 0;
          toast({
            description: `New game session detected. Connected to iRacing server: ${gameSession.gameAssignedSessionId}`,
          });
        },
      );

      gameDataHubConnection.on(
        "TrackSessionChanged",
        (trackSession: BaseTrackSession) => {
          dispatch(pitwallSlice.actions.changeTrackSession(trackSession));
          lapsLastUpdateGameTime = 0;
          telemetryLapsLastUpdateGameTime = 0;
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
          sessionDynamicDataLastResponse = Date.now();
        },
      );

      gameDataHubConnection.on("StandingsUpdate", (standings) => {
        dispatch(pitwallSlice.actions.setStandings(standings));
        standingsDataLastResponse = Date.now();
      });
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
  }, [
    pitwallSession,
    selectedDataProvider,
    selectedIRacingSessionId,
    oAuthToken,
    dispatch,
    toast,
  ]);
  // #endregion

  // #region Laps
  useEffect(() => {
    if (
      isDataConnectionStarted &&
      gameDataConnection?.current != undefined &&
      currentTrackSessionNumber != undefined &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null
    ) {
      gameDataConnection.current.on(
        "NewLapsResponse",
        (completedLaps: CompletedLaps) => {
          dispatch(pitwallSlice.actions.addLaps(completedLaps));
          lapsLastUpdateGameTime = completedLaps.lastUpdate;
          lapsLastResponse = Date.now();
        },
      );
      var lapsLastRequest = 0;
      gameDataConnection.current.on("NewLapsAvailable", async () => {
        if (lapsLastResponse > lapsLastRequest) {
          lapsLastRequest = Date.now();
          await gameDataConnection.current?.invoke("RequestLaps", {
            providerId: selectedDataProvider.id,
            sessionNumber: currentTrackSessionNumber,
            gameAssignedSessionId: selectedIRacingSessionId,
            SessionElapsedTime: lapsLastUpdateGameTime,
          });
        }
      });
    }
  }, [
    gameDataConnection,
    isDataConnectionStarted,
    selectedDataProvider,
    selectedIRacingSessionId,
    currentTrackSessionNumber,
    dispatch,
  ]);
  // #endregion Laps

  // #region Dynamic Track Session Data
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

  // #region Standings
  useEffect(() => {
    if (
      gameDataConnection != undefined &&
      currentTrackSessionNumber != undefined &&
      selectedDataProvider != null &&
      selectedIRacingSessionId != null
    ) {
      var lastRequest1 = 0;
      if (standingsDataRequestTimer.current != null) {
        clearInterval(standingsDataRequestTimer.current);
      }
      standingsDataRequestTimer.current = setInterval(async () => {
        if (
          standingsDataLastResponse > lastRequest1 &&
          gameDataConnection.current?.state === HubConnectionState.Connected
        ) {
          lastRequest1 = Date.now();
          await gameDataConnection.current?.invoke("RequestStandings", {
            providerId: selectedDataProvider.id,
            sessionNumber: currentTrackSessionNumber,
            gameAssignedSessionId: selectedIRacingSessionId,
          });
        }
      }, 400);
    }
    return () => {
      if (standingsDataRequestTimer.current != null) {
        clearInterval(standingsDataRequestTimer.current);
      }
    };
  }, [
    gameDataConnection,
    selectedDataProvider,
    selectedIRacingSessionId,
    currentTrackSessionNumber,
  ]);
  // #endregion

  // #region Telemetry
  useEffect(() => {
    const connectToTelemetry = async (
      pitwallSession: PitwallSession,
      selectedTelemetryProvider: BaseTelemetryProvider,
      selectedIRacingSessionId: string | undefined,
      telemetryHub: HubConnection,
    ) => {
      await telemetryConnection.current?.stop();
      if (selectedIRacingSessionId != null) {
        //TODO: Get lap history
        // var gameDataResponse = await axios.get(
        //   `${API_V2_URL}/pitwall/session/${pitwallSession.id}/gamedata/${selectedTelemetryProvider.id}/gamesessionid/${selectedIRacingSessionId}`,
        // );
        // dispatch(pitwallSlice.actions.setGameSession(gameDataResponse.data));
      }
      await telemetryHub.start();
      telemetryConnection.current = telemetryHub;
      setTelemetryConnectionStarted(true);
    };
    if (
      pitwallSession != null &&
      selectedTelemetryProvider != null &&
      oAuthToken != null
    ) {
      const telemetryHubConnection = buildHubConnection(
        oAuthToken,
        pitwallSession.webSocketEndpoints.v2TelemetrySubscriber,
        selectedTelemetryProvider.pitwallSessionId,
        selectedTelemetryProvider.id,
      );

      telemetryHubConnection.on("TelemetryUpdate", (telemetry: Telemetry) => {
        dispatch(pitwallSlice.actions.setTelemetry(telemetry));
        telemetryDataLastResponse = Date.now();
      });

      telemetryHubConnection.on(
        "TelemetryProviderUpdate",
        (telemetryProvider: BaseTelemetryProvider) => {
          dispatch(
            pitwallSlice.actions.updateTelemetryProvider(telemetryProvider),
          );
          telemetryDataLastResponse = Date.now();
        },
      );

      connectToTelemetry(
        pitwallSession,
        selectedTelemetryProvider,
        selectedIRacingSessionId,
        telemetryHubConnection,
      );
      return () => {
        if (telemetryHubConnection != null) {
          telemetryHubConnection.stop();
        }
      };
    }
  }, [
    pitwallSession,
    selectedTelemetryProvider,
    selectedIRacingSessionId,
    oAuthToken,
    dispatch,
  ]);

  useEffect(() => {
    if (
      isTelemetryConnectionStarted &&
      telemetryConnection?.current != undefined &&
      currentTrackSessionNumber != undefined &&
      selectedTelemetryProvider != null &&
      selectedIRacingSessionId != null
    ) {
      telemetryConnection.current.on(
        "CompletedLapTelemetryUpdate",
        (telemetryLaps: CompletedTelemetryLaps) => {
          dispatch(pitwallSlice.actions.addTelemetryLaps(telemetryLaps));
          telemetryLapsLastUpdateGameTime = telemetryLaps.lastUpdate;
        },
      );

      telemetryConnection.current.on("NewTelemetryLap", async () => {
        await telemetryConnection.current?.invoke("RequestTelemetryLaps", {
          providerId: selectedTelemetryProvider.id,
          sessionNumber: currentTrackSessionNumber,
          gameAssignedSessionId: selectedIRacingSessionId,
          SessionElapsedTime: telemetryLapsLastUpdateGameTime,
        });
      });
    }
  }, [
    telemetryConnection,
    isTelemetryConnectionStarted,
    selectedTelemetryProvider,
    selectedIRacingSessionId,
    currentTrackSessionNumber,
    dispatch,
  ]);

  useEffect(() => {
    if (
      telemetryConnection != undefined &&
      selectedTelemetryProvider != null &&
      selectedIRacingSessionId != null
    ) {
      var lastRequest2 = 0;
      if (telemetryDataRequestTimer.current != null) {
        clearInterval(telemetryDataRequestTimer.current);
      }
      telemetryDataRequestTimer.current = setInterval(async () => {
        if (
          telemetryDataLastResponse > lastRequest2 &&
          telemetryConnection.current?.state === HubConnectionState.Connected
        ) {
          lastRequest2 = Date.now();
          await telemetryConnection.current?.invoke("RequestTelemetry", {
            providerId: selectedTelemetryProvider.id,
            gameAssignedSessionId: selectedIRacingSessionId,
          });
        }
      }, 400);
    }
    return () => {
      if (telemetryDataRequestTimer.current != null) {
        clearInterval(telemetryDataRequestTimer.current);
      }
    };
  }, [
    telemetryConnection,
    selectedTelemetryProvider,
    selectedIRacingSessionId,
  ]);
  // #endregion

  function LoadingWrapper({ children }: { children: React.ReactNode }) {
    if (isLoading) {
      return <div> loading... </div>;
    } else {
      return <>{children}</>;
    }
  }

  return <>{LoadingWrapper({ children })}</>;
}
