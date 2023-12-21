'use client'
import { useState, useEffect } from 'react'
import {
    standingsSlice,
    useDispatch
} from '@/lib/redux'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios'
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
import { API_BASE_URL, API_V1_URL } from "@/config/domain.config"

let sessionDynamicDataLastResponse = 1
let standingsDataLastResponse = 1
let _lapsLastUpdate = -1
let _lapsLastTelemetryLap = -1
let _isCarTelemetryActive = false

export default function PitwallSession({ children, pitwallSessionId }: { children: React.ReactNode, pitwallSessionId: string }) {
    const dispatch = useDispatch()

    //Page State
    const [isLoading, setLoading] = useState(true);

    //Web-Socket Connections
    const [sessionConnection, setSessionConnection] = useState<HubConnection>();
    const [standingsConnection, setStandingsConnection] = useState<HubConnection>();

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    //Session state
    const [joinSessionLastLapSessionTime, setJoinSessionLastLapSessionTime] = useState(-1);
    const [joinSessionLastTelemetryLap, setJoinSessionLastTelemetryLap] = useState(-1);

    // #region Session Join Request
    useEffect(() => {
        const joinSesion = async () => {
            setLoading(true)
            var joinSessionResponse = await axios.get(`${API_V1_URL}/pitbox/session/${pitwallSessionId}`);
            await sleep(500)
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

            await sessionConnection.start()
            await standingsConnection.start()
            setSessionConnection(sessionConnection)
            setStandingsConnection(standingsConnection)

            setLoading(false)
        }
        joinSesion();
    }, []);


    const buildHubConnection = (socketEndpoint: string, sessionId: string) => {
        const options = {
            //accessTokenFactory: () => auth.getAccessToken()
        };
        return new HubConnectionBuilder()
            .withUrl(API_BASE_URL + socketEndpoint + "?sessionId=" + sessionId, options)
            .withAutomaticReconnect()
            .build()
    }
    // #endregion

    // #region Session WebSocket Connection
    useEffect(() => {
        if (sessionConnection) {
            const connect = async () => {
                sessionConnection.on('onSessionReset', pitboxSession => {
                    //console.log('onSessionReset', pitboxSession)
                    _lapsLastUpdate = 0
                    _lapsLastTelemetryLap = 0
                })
                sessionConnection.on('onTrackSessionChanged', trackSession => {
                    //console.log('trackSession', trackSession)
                    _lapsLastUpdate = 0
                    _lapsLastTelemetryLap = 0
                })
                sessionConnection.on('onDynamicSessionDataUpdate', dynamicSessionData => {
                    //console.log('dynamicSessionData', dynamicSessionData)
                    if (dynamicSessionData?.timing?.simTimeOfDay) {
                        var seconds = dynamicSessionData.timing.simTimeOfDay; // Some arbitrary value
                        var date = new Date(seconds * 1000); // multiply by 1000 because Date() requires miliseconds
                        var timeStr = date.toISOString();
                        dynamicSessionData.timing.simTimeOfDay = timeStr
                    }
                    _isCarTelemetryActive = dynamicSessionData.isCarTelemetryActive
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
                    if ((sessionDynamicDataLastResponse > lastRequest1)) {
                        lastRequest1 = Date.now();
                        await sessionConnection.invoke("RequestDynamicSessionData", { sessionId: pitwallSessionId, teamId: "" });
                    }
                },
                1000)
            async () => await clearIntervalAsync(timer);
        }
    }, [sessionConnection]);

    // #endregion

    // #region Standings WebSocket Connection
    useEffect(() => {
        if (standingsConnection) {
            const connect = async () => {
                standingsConnection.on('onStandingsUpdate', standings => {
                    //console.log('standings', standings)
                    dispatch(standingsSlice.actions.update(standings))
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
                    if ((standingsDataLastResponse > lastRequest)) {
                        lastRequest = Date.now();
                        await standingsConnection.invoke("RequestStandings", { sessionId: pitwallSessionId, teamId: "" });
                    }
                },
                333)
            async () => await clearIntervalAsync(timer);
        }
    }, [standingsConnection]);


    function LoadingWrapper({ children }: { children: React.ReactNode }) {
        if (isLoading) {
            return <div> loading... </div>
        } else {
            return children
        }
    }

    return (
        <>
            {LoadingWrapper({ children })}
        </>
    )
}