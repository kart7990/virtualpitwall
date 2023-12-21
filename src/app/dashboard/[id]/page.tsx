"use client"
import { useState, useEffect } from 'react'
import { Card, Grid, Tab, TabGroup, Metric, Flex, ProgressBar, TabList, TabPanel, TabPanels, Text, Title, } from "@tremor/react"
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios'
import GridLayout from "react-grid-layout"
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'

import {
    standingsSlice,
    useDispatch
  } from '@/lib/redux'

import { API_BASE_URL, API_V1_URL } from "@/config/domain.config"
import { Standings } from '@/app/components/standings/standings';
import { TrackMap } from '@/app/components/trackmap/trackmap';

let sessionDynamicDataLastResponse = 1
let standingsDataLastResponse = 1
let _lapsLastUpdate = -1
let _lapsLastTelemetryLap = -1
let _isCarTelemetryActive = false

export default function Page({ params }: { params: { id: string } }) {
    const dispatch = useDispatch()
    const pitboxSessionId = params.id
    console.log(pitboxSessionId)

    //Web-Socket Connections
    const [sessionConnection, setSessionConnection] = useState<HubConnection>();
    const [standingsConnection, setStandingsConnection] = useState<HubConnection>();

    //Session state
    const [joinSessionLastLapSessionTime, setJoinSessionLastLapSessionTime] = useState(-1);
    const [joinSessionLastTelemetryLap, setJoinSessionLastTelemetryLap] = useState(-1);

    // #region Session Join Request
    useEffect(() => {
        const joinSesion = async () => {
            var joinSessionResponse = await axios.get(`${API_V1_URL}/pitbox/session/${pitboxSessionId}`);

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
                        await sessionConnection.invoke("RequestDynamicSessionData", { sessionId: pitboxSessionId, teamId: "" });
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
                        await standingsConnection.invoke("RequestStandings", { sessionId: pitboxSessionId, teamId: "" });
                    }
                },
                333)
            async () => await clearIntervalAsync(timer);
        }
    }, [standingsConnection]);

    // #endregion


    return (
        <main className="p-12">
            <Title>Dashboard</Title>
            <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

            <TabGroup className="mt-6">
                <TabList>
                    <Tab>Overview</Tab>
                    <Tab>Detail</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                            <Card>
                                {/* Placeholder to set height */}
                                <div className="h-28" />
                            </Card>
                            <Card>
                                {/* Placeholder to set height */}
                                <div className="h-28" />
                            </Card>
                            <Card className="max-w-xs mx-auto">
                                <Text>Sales</Text>
                                <Metric>$ 71,465</Metric>
                                <Flex className="mt-4">
                                    <Text>32% of annual target</Text>
                                    <Text>$ 225,000</Text>
                                </Flex>
                                <ProgressBar value={32} className="mt-2" />
                            </Card>
                        </Grid>
                        <div className="mt-6">
                            <Card>
                                <div className="h-80" />
                            </Card>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <GridLayout className="layout" cols={12} rowHeight={30} width={4000}>
                            <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2 }}>
                                <Standings/>
                            </div>
                            <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>
                                <Card className="h-full">
                                </Card>
                            </div>
                            <div key="c" data-grid={{ x: 0, y: 3, w: 5, h: 20 }}>
                                <Card className="h-full overflow-hidden">
                                    <TrackMap/>
                                </Card>
                            </div>
                        </GridLayout>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    )
}