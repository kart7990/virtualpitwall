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

  const trackSessionNumber = useSelector(selectCurrentTrackSessionNumber);
  const oAuthToken = useSelector(selectOAuthToken);
  _trackSessionNumber = trackSessionNumber;

  // #region Session Join Request
  useEffect(() => {
    const joinSession = async () => {
      setLoading(true);
      var joinSessionResponse = await axios.get(
        `${API_V2_URL}/pitbox/session/${pitwallSessionId}`,
      );
      dispatch(sessionSlice.actions.init(joinSessionResponse.data));
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

      await sessionConnection.start();

      setSessionConnection(sessionConnection);

      setLoading(false);
    };
    joinSession();
  }, [pitwallSessionId, dispatch, oAuthToken]);
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on("onGameDataProvider", () => {
          dispatch(sessionSlice.actions.reset());
        });
        sessionConnection.on("onTrackSessionChanged", (trackSession) => {
          dispatch(sessionSlice.actions.trackSessionChange(trackSession));
        });
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

  function LoadingWrapper({ children }: { children: React.ReactNode }) {
    if (isLoading) {
      return <div> loading... </div>;
    } else {
      return children;
    }
  }

  return <>{LoadingWrapper({ children })}</>;
}
