import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    CRow,
    CButton,
} from '@coreui/react'
import * as auth from '../../auth/authCore';
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'


import axios from 'axios';
import { API_URL, API_DOMAIN } from '../../apiConfig';
import { HubConnectionBuilder } from '@microsoft/signalr';

const DevDashboard = () => {
    const isSessionActive = useSelector(state => state.session?.isActive)
    const [sessionConnection, setSessionConnection] = useState(null);
    const [standingsConnection, setStandingsConnection] = useState(null);
    const [telemetryConnection, setTelemetryConnection] = useState(null);
    const [lapsConnection, setLapsConnection] = useState(null);
    const [isConnectionActive, setConnectionActive] = useState(false);
    const [id, setId] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [telemetryData, setTelemetryData] = useState(null);
    const [joinSessionLastLapSessionTime, setJoinSessionLastLapSessionTime] = useState(0);
    const [standingsData, setStandingsData] = useState(null);
    const [lapsData, setLapsData] = useState([]);
    const [telemetryLapsData, setTelemetryLapsData] = useState([]);
    const [telemetryDataLastResponse, setTelemetryDataLastResponse] = useState(1);
    const [sessionDataLastResponse, setSessionDataLastResponse] = useState(1);
    const [sessionDataLastRequest, setSessionDataLastRequest] = useState(0);
    const [standingsDataLastResponse, setStandingsDataLastResponse] = useState(1);
    const [standingsDataLastRequest, setStandingsDataLastRequest] = useState(0);


    useEffect(() => {
        const connect = async () => {
            if (sessionConnection) {
                var sessionData = null;
                sessionConnection.on('onTrackSessionChanged', message => {
                    setLapsData([])
                    setTelemetryLapsData([])
                    setStandingsData(null)
                    setTelemetryData(null)
                    sessionData = message;
                    setSessionData(message);
                })
                sessionConnection.on('onDynamicSessionDataUpdate', message => {
                    //console.log('message', message)
                    //console.log('onSessionDataUpdate: ' + Date.now(), message)
                    if (message?.timing?.simTimeOfDay) {
                        var seconds = message.timing.simTimeOfDay; // Some arbitrary value
                        var date = new Date(seconds * 1000); // multiply by 1000 because Date() requires miliseconds
                        var timeStr = date.toISOString();
                        message.timing.simTimeOfDay = timeStr
                    }

                    var data = {
                        ...sessionData,
                        ...message
                    };

                    setSessionData(data)
                    setSessionDataLastResponse(Date.now())
                })
                setConnectionActive(true)
            }
        }
        connect()
    }, [sessionConnection]);

    useEffect(() => {
        if (isConnectionActive) {
            const timer = setIntervalAsync(
                async () => {
                    if (sessionDataLastResponse > sessionDataLastRequest) {
                        setSessionDataLastRequest(Date.now());
                        await sessionConnection.invoke("RequestDynamicSessionData", { sessionId: id, teamId: "" });
                    }
                    else {
                        console.log('Previous session data not recieved yet, skipping.')
                    }
                },
                500)

            return async () => await clearIntervalAsync(timer);
        }
    }, [sessionConnection, isConnectionActive, sessionDataLastRequest, sessionDataLastResponse, id]);

    useEffect(() => {
        const connect = async () => {
            if (standingsConnection) {
                standingsConnection.on('onStandingsUpdate', message => {
                    setStandingsData(message)
                    setStandingsDataLastResponse(Date.now())
                })
            }
        }
        connect()
    }, [standingsConnection]);

    useEffect(() => {
        if (standingsConnection) {
            const timer = setIntervalAsync(
                async () => {
                    if (standingsDataLastResponse > standingsDataLastRequest) {
                        setStandingsDataLastRequest(Date.now());
                        await standingsConnection.invoke("RequestStandings", { sessionId: id, teamId: "" });
                    }
                    else {
                        console.log('Previous standings data not recieved yet, skipping.')
                    }
                },
                200)

            return async () => await clearIntervalAsync(timer);
        }
    }, [standingsConnection, standingsDataLastRequest, standingsDataLastResponse, id]);

    useEffect(() => {
        const connect = async () => {
            if (telemetryConnection) {
                try {
                    telemetryConnection.on('onTelemetryUpdate', message => {
                        setTelemetryData(message)
                        setTelemetryDataLastResponse(Date.now())
                    })
                }
                catch (ex) {
                    console.log('Connection failed: ', ex)
                }
            }
        }
        connect()
    }, [telemetryConnection]);

    useEffect(() => {
        if (telemetryConnection) {
            var lastRequest = 0;
            const timer = setIntervalAsync(
                async () => {
                    if (telemetryDataLastResponse > lastRequest) {
                        lastRequest = Date.now();
                        await telemetryConnection.invoke("RequestTelemetry", { sessionId: id, teamId: "" });
                    }
                    else {
                        console.log('Previous telemetry data not recieved yet, skipping.')
                    }
                },
                200)

            return async () => await clearIntervalAsync(timer);
        }
    }, [telemetryConnection, telemetryDataLastResponse, id]);

    useEffect(() => {
        const connect = async () => {
            console.log('LAPS CONNECTION INVOKED')
            console.log(sessionData?.sessionNumber)
            console.log(joinSessionLastLapSessionTime)

            if (lapsConnection) {
                var lastUpdate = joinSessionLastLapSessionTime;
                var laps = [];
                try {
                    lapsConnection.on('onLapsUpdate', message => {
                        lastUpdate = message.item1
                        laps = laps.concat(message.item2)
                        setLapsData(laps)
                    })

                    lapsConnection.on('onLapsReceived', async () => {
                        if (sessionData?.sessionNumber != null) {
                            await lapsConnection.invoke("RequestLaps", { sessionId: id, teamId: "", sessionNumber: sessionData.sessionNumber, sessionElapsedTime: lastUpdate });
                        }
                    })
                }
                catch (ex) {
                    console.log('Connection failed: ', ex)
                }
            }
        }
        connect()
    }, [lapsConnection, sessionData?.sessionNumber, joinSessionLastLapSessionTime]);

    useEffect(() => {
        const connect = async () => {
            if (lapsConnection) {
                var lastLapNumber = 0;
                var laps = [];
                try {
                    lapsConnection.on('onLapTelemetryUpdate', lapResponse => {
                        console.log('telemetryLaps', lapResponse)
                        lastLapNumber = lapResponse.reduce((a, b) => a.lapNumber > b.lapNumber ? a : b).lapNumber;
                        console.log('lastLapNumber', lastLapNumber)
                        laps = laps.concat(lapResponse)
                        setTelemetryLapsData(laps)
                    })

                    lapsConnection.on('onLapTelemetryReceived', async () => {
                        if (sessionData?.sessionNumber != null) {
                            await lapsConnection.invoke("RequestTelemetryLaps", { sessionId: id, teamId: "", sessionNumber: sessionData.sessionNumber, lastLapNumber: lastLapNumber });
                        }
                    })
                }
                catch (ex) {
                    console.log('Connection failed: ', ex)
                }
            }
        }
        connect()
    }, [lapsConnection, sessionData?.sessionNumber]);


    const joinSession = async () => {
        console.log('START SESSION')
        var joinSessionResponse = await axios.get(`${API_URL}/pitbox/session/fdaaebe7-a971-4ea7-9dff-7439a306b35d`);
        setId(joinSessionResponse.data.pitBoxSession.id)
        console.log('laps', joinSessionResponse.data.completedLaps);
        if (joinSessionResponse.data.completedLaps.length > 0) {
            const [lastLap] = joinSessionResponse.data.completedLaps.slice(-1)
            console.log('lastLap', lastLap)
            setJoinSessionLastLapSessionTime(lastLap.sessionTimeLapEnd)
        }
        console.log('joinResponse', joinSessionResponse)
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
        setLapsData(joinSessionResponse.data.completedLaps)
    }

    const buildHubConnection = (path, sessionId) => {
        const options = {
            accessTokenFactory: () => auth.getAccessToken()
        };
        return new HubConnectionBuilder()
            .withUrl(API_DOMAIN + path + "?sessionId=" + sessionId, options)
            .withAutomaticReconnect()
            .build()
    }


    const startSession = async () => {
        console.log('START SESSION')
        var createSessionResponse = await axios.post(`${API_URL}/pitbox/session`);
        setId(createSessionResponse.data.id)
        console.log('createResp', createSessionResponse)

        const options = {
            accessTokenFactory: () => auth.getAccessToken()
        };

        const hubConnection = new HubConnectionBuilder()
            .withUrl(API_DOMAIN + createSessionResponse.data.webSocketEndpoints[0] + "?sessionId=" + createSessionResponse.data.sessionId, options)
            .withAutomaticReconnect()
            .build();

        setSessionConnection(hubConnection);
    }
    const sendMessage = async () => {
        await sessionConnection.invoke("SendMessage", "hi from client");

        // var sendMessageResp = await axios.post(`${API_URL}/pitbox/session/sendMessage`, { Id: id, Message: "hello worldfghfghfgh" });
        // console.log('sendMessageResp', sendMessageResp)
    }

    const sendGroupMessage = async () => {
        var sendMessageResp = await axios.post(`${API_URL}/pitbox/session/sendGroupMessage`, { Id: id, Message: "hello group world" });
        console.log('sendMessageResp', sendMessageResp)
    }

    return (
        <>
            <p>Dev Dashboard</p>
            <CRow>
                <CButton
                    color="success"
                    onClick={() => joinSession()}>
                    Join Session
                </CButton>
                <CButton
                    color="success"
                    onClick={() => startSession()}>
                    Create Session
                </CButton>

                <CButton
                    color="success"
                    onClick={() => sendMessage()}>
                    Send Message
                </CButton>

                <CButton
                    color="success"
                    onClick={() => sendGroupMessage()}>
                    Send Group Message
                </CButton>
            </CRow>

            <CRow>
                <div><pre>{JSON.stringify(telemetryData, null, 2)}</pre></div>
            </CRow>
            <CRow>
                <div><pre>{JSON.stringify(telemetryLapsData, null, 2)}</pre></div>
            </CRow>
            <CRow>
                <div><pre>{JSON.stringify(sessionData, null, 2)}</pre></div>
            </CRow>
            {/* <CRow>
                <div><pre>{JSON.stringify(standingsData, null, 2)}</pre></div>
            </CRow> */}
            <CRow>
                <div><pre>{JSON.stringify(lapsData, null, 2)}</pre></div>
            </CRow>
        </>
    )
}

export default DevDashboard
