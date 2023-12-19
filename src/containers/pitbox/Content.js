import React, { Suspense, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { useLocation, matchPath } from 'react-router';
import { CContainer } from '@coreui/react'
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

//pitbox dependencies
import { API_DOMAIN_RAW, API_URL } from '../../apiConfig';
import * as auth from '../../auth/authCore';
import { pitboxSessionJoin, trackSessionChange, trackSessionUpdate, pitboxSessionReset } from './session/SessionActions';
import { standingsUpdate, standingsClear } from './standings/StandingsActions';
import { addTelemetryLaps, telemetryUpdate } from './telemetry/TelemetryActions';

// routes config
import routes from './routes'
import { addLaps } from './laps/LapActions';

const Page404 = React.lazy(() => import('../../views/pages/page404/Page404'));


let sessionDynamicDataLastResponse = 1
let standingsDataLastResponse = 1
let telemetryDataLastResponse = 1
let _trackSessionNumber = -1
let _lapsLastUpdate = -1
let _lapsLastTelemetryLap = -1
let _isCarTelemetryActive = false

const Content = () => {
  const dispatch = useDispatch()

  //Page State
  const [isLoading, setLoading] = useState(true);

  //Web-Socket Connections
  const [sessionConnection, setSessionConnection] = useState(null);
  const [standingsConnection, setStandingsConnection] = useState(null);
  const [telemetryConnection, setTelemetryConnection] = useState(null);
  const [lapsConnection, setLapsConnection] = useState(null);

  //Session state
  const isAvailable = useSelector(state => state.pitboxSession?.eventDetails?.isAvailable)
  const trackSessionNumber = useSelector(state => state.pitboxSession?.eventDetails?.currentTrackSessionNumber)
  const [joinSessionLastLapSessionTime, setJoinSessionLastLapSessionTime] = useState(-1);
  const [joinSessionLastTelemetryLap, setJoinSessionLastTelemetryLap] = useState(-1);
  _trackSessionNumber = trackSessionNumber

  //Response Tracking
  // const [sessionDynamicDataLastResponse, setSessionDynamicDataLastResponse] = useState(1);
  // const [standingsDataLastResponse, setStandingsDataLastResponse] = useState(1);

  const location = useLocation();

  let match = matchPath(location.pathname, {
    path: "/pitbox/:id",
    strict: false
  });

  let pitboxSessionId = null

  if (match.params) {
    pitboxSessionId = match.params.id;

  }

  // #region Session Join Request
  useEffect(() => {
    const joinSesion = async () => {
      setLoading(true)
      var joinSessionResponse = await axios.get(`${API_URL}/pitbox/session/${pitboxSessionId}`);
      dispatch(pitboxSessionJoin(joinSessionResponse.data))

      if (joinSessionResponse.data.completedLaps.length > 0) {
        const [lastLap] = joinSessionResponse.data.completedLaps.slice(-1)
        setJoinSessionLastLapSessionTime(lastLap.sessionTimeLapEnd)
      } else {
        setJoinSessionLastLapSessionTime(0)
      }

      if (joinSessionResponse.data.telemetryLaps.length > 0) {
        const [lastLap] = joinSessionResponse.data.telemetryLaps.slice(-1)
        setJoinSessionLastTelemetryLap(lastLap.lapNumber)
      } else {
        setJoinSessionLastTelemetryLap(0)
      }


      var sessionConnection = buildHubConnection(joinSessionResponse.data.webSocketEndpoints.Session, joinSessionResponse.data.pitBoxSession.id)
      var standingsConnection = buildHubConnection(joinSessionResponse.data.webSocketEndpoints.Standings, joinSessionResponse.data.pitBoxSession.id);
      var lapsConnection = buildHubConnection(joinSessionResponse.data.webSocketEndpoints.Laps, joinSessionResponse.data.pitBoxSession.id);
      var telemetryConnection = buildHubConnection(joinSessionResponse.data.webSocketEndpoints.Telemetry, joinSessionResponse.data.pitBoxSession.id);


      await sessionConnection.start()
      await standingsConnection.start()
      await lapsConnection.start()
      await telemetryConnection.start()
      setSessionConnection(sessionConnection);
      setStandingsConnection(standingsConnection);
      setLapsConnection(lapsConnection);
      setTelemetryConnection(telemetryConnection);

      //setLapsData(joinSessionResponse.data.completedLaps)
      // if (joinSessionResponse.data.completedLaps.length > 0) {
      //   const [lastLap] = joinSessionResponse.data.completedLaps.slice(-1)
      //   console.log('lastLap', lastLap)
      //   setJoinSessionLastLapSessionTime(lastLap.sessionTimeLapEnd)
      // }
      setLoading(false)
    }
    joinSesion();
  }, []);


  const buildHubConnection = (path, sessionId) => {
    const options = {
      accessTokenFactory: () => auth.getAccessToken()
    };
    return new HubConnectionBuilder()
      .withUrl(API_DOMAIN_RAW + path + "?sessionId=" + sessionId, options)
      .withAutomaticReconnect()
      .build()
  }
  // #endregion

  // #region Session WebSocket Connection
  useEffect(() => {
    if (sessionConnection) {
      const connect = async () => {
        sessionConnection.on('onSessionReset', pitboxSession => {
          dispatch(standingsClear())
          dispatch(pitboxSessionReset(pitboxSession))
          _lapsLastUpdate = 0
          _lapsLastTelemetryLap = 0
        })
        sessionConnection.on('onTrackSessionChanged', trackSession => {
          dispatch(standingsClear())
          dispatch(trackSessionChange(trackSession))
          _lapsLastUpdate = 0
          _lapsLastTelemetryLap = 0
        })
        sessionConnection.on('onDynamicSessionDataUpdate', dynamicSessionData => {
          if (dynamicSessionData?.timing?.simTimeOfDay) {
            var seconds = dynamicSessionData.timing.simTimeOfDay; // Some arbitrary value
            var date = new Date(seconds * 1000); // multiply by 1000 because Date() requires miliseconds
            var timeStr = date.toISOString();
            dynamicSessionData.timing.simTimeOfDay = timeStr
          }
          _isCarTelemetryActive = dynamicSessionData.isCarTelemetryActive
          dispatch(trackSessionUpdate(dynamicSessionData))
          sessionDynamicDataLastResponse = Date.now()
        })
      }
      connect()
    }
  }, [sessionConnection]);

  useEffect(() => {
    if (sessionConnection) {
      var lastRequest1 = 0;
      const timer = setIntervalAsync(
        async () => {
          if ((sessionDynamicDataLastResponse > lastRequest1) && isAvailable) {
            lastRequest1 = Date.now();
            await sessionConnection.invoke("RequestDynamicSessionData", { sessionId: pitboxSessionId, teamId: "" });
          }
        },
        1000)
      return async () => await clearIntervalAsync(timer);
    }
  }, [sessionConnection, isAvailable]);

  // #endregion

  // #region Standings WebSocket Connection
  useEffect(() => {
    if (standingsConnection) {
      const connect = async () => {
        standingsConnection.on('onStandingsUpdate', standings => {
          dispatch(standingsUpdate(standings))
          standingsDataLastResponse = Date.now()
        })
      }
      connect()
    }
  }, [standingsConnection]);

  useEffect(() => {
    if (standingsConnection) {
      var lastRequest = 0;
      const timer = setIntervalAsync(
        async () => {
          if ((standingsDataLastResponse > lastRequest) && isAvailable) {
            lastRequest = Date.now();
            await standingsConnection.invoke("RequestStandings", { sessionId: pitboxSessionId, teamId: "" });
          }
        },
        333)

      return async () => await clearIntervalAsync(timer);
    }
  }, [standingsConnection, isAvailable]);

  // #endregion

  // #region Laps WebSocket Connection
  useEffect(() => {
    const connect = async () => {
      // don't need isActive check, laps are only requested when notified of new laps
      if (lapsConnection && joinSessionLastLapSessionTime > -1) {
        _lapsLastUpdate = joinSessionLastLapSessionTime;
        lapsConnection.on('onLapsUpdate', message => {
          _lapsLastUpdate = message.item1
          dispatch(addLaps(_trackSessionNumber, message.item2))
        })

        lapsConnection.on('onLapsReceived', async () => {
          if (_trackSessionNumber >= 0) {
            await lapsConnection.invoke("RequestLaps", { sessionId: pitboxSessionId, teamId: "", sessionNumber: _trackSessionNumber, sessionElapsedTime: _lapsLastUpdate });
          }
        })
      }
    }
    connect()
  }, [lapsConnection, joinSessionLastLapSessionTime]);

  useEffect(() => {
    const connect = async () => {
      if (lapsConnection && joinSessionLastTelemetryLap > -1) {
        _lapsLastTelemetryLap = joinSessionLastTelemetryLap;
          lapsConnection.on('onLapTelemetryUpdate', lapResponse => {
            _lapsLastTelemetryLap = lapResponse.reduce((a, b) => a.lapNumber > b.lapNumber ? a : b).lapNumber;
            dispatch(addTelemetryLaps(_trackSessionNumber, lapResponse))
          })

          lapsConnection.on('onLapTelemetryReceived', async () => {
            if (_trackSessionNumber != null) {
              await lapsConnection.invoke("RequestTelemetryLaps", { sessionId: pitboxSessionId, teamId: "", sessionNumber: _trackSessionNumber, lastLapNumber: _lapsLastTelemetryLap });
            }
          })
      }
    }
    connect()
  }, [lapsConnection, joinSessionLastTelemetryLap]);
  // #endregion

  // #region Telemetry WebSocket Connection
  useEffect(() => {
    if (telemetryConnection) {
      const connect = async () => {
        telemetryConnection.on('onTelemetryUpdate', message => {
          dispatch(telemetryUpdate(message))
          telemetryDataLastResponse = Date.now()
        })
      }
      connect()
    }
  }, [telemetryConnection]);

  useEffect(() => {
    if (telemetryConnection && isAvailable) {
      var lastRequest = 0;
      const timer = setIntervalAsync(
        async () => {
          if (_isCarTelemetryActive && (telemetryDataLastResponse > lastRequest)) {
            lastRequest = Date.now();
            await telemetryConnection.invoke("RequestTelemetry", { sessionId: pitboxSessionId, teamId: "" });
          }
          else {
            console.log('Previous standings data not recieved yet, skipping.')
          }
        },
        333)

      return async () => await clearIntervalAsync(timer);
    }
  }, [telemetryConnection, isAvailable]);
  // #endregion

  function RenderContainerContents(props) {
    const isLoading = props.isLoading;
    if (isLoading) {
      return <div>connecting...</div>;
    } else if (!isAvailable) {
      return <div>waiting for session data...</div>
    } else {
      return <Suspense fallback={<div>loading</div>}>
        <Switch>
          {routes.map((route, idx) => {
            return route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                  <route.component {...props} />
                )} />
            )
          })}
          {/* NOTE: REDIRECT WILL NOT WORK IF LOADING CONDITION IS TRUE */}
          <Redirect from="/pitbox/:id" to="/pitbox/:id/dashboard" />
          <Route path="*" render={props => <Page404 {...props} />} />
        </Switch>
      </Suspense>
    }
  }

  return (
    <main className="c-main">
      <CContainer fluid>
        <RenderContainerContents isLoading={isLoading} />
      </CContainer>
    </main>
  )
}

export default React.memo(Content)
