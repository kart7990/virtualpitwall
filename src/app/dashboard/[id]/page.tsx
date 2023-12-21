"use client"
import { Card, Grid, Tab, TabGroup, Metric, Flex, ProgressBar, TabList, TabPanel, TabPanels, Text, Title, } from "@tremor/react"
import GridLayout, { ItemCallback } from "react-grid-layout"

import PitwallSession from '@/app/components/connection/pitwallSession';
import { Standings } from '@/app/components/standings/standings';
import { TrackMap } from '@/app/components/trackmap/trackmap';



export default function Page({ params }: { params: { id: string } }) {
    const pitboxSessionId = params.id
    console.log(pitboxSessionId)

    // #endregion
    const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
        console.log('DH-RESIZE', newItem.i)
    };

    return (
        <PitwallSession pitwallSessionId={pitboxSessionId}>
            <main className="p-12">
                <Title>Dashboard</Title>
                <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

                <TabGroup className="mt-6">
                    <TabList>
                        <Tab>Overview</Tab>
                        <Tab>Details</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <GridLayout className="layout" cols={12} rowHeight={30} width={4000} onResizeStop={onResizeStopped}>
                                <div key="a" data-grid={{ x: 2, y: 0, w: 3, h: 15, minH: 6 }}>
                                    <Standings />
                                </div>
                                <div key="trackMap" data-grid={{ x: 0, y: 3, w: 2, h: 15, minH: 6 }}>
                                    <Card className="h-full overflow-hidden">
                                        <TrackMap />
                                    </Card>
                                </div>
                                <div key="b" data-grid={{ x: 0, y: 5, w: 3, h: 2, minW: 2, maxW: 4 }}>
                                    <Card className="h-full">
                                        {/* <Logs logs={['abc123', 'asdad', 'asdasdas']} /> */}
                                    </Card>
                                </div>
                            </GridLayout>
                        </TabPanel>
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

                                </Card>
                            </Grid>
                            <div className="mt-6">
                                <Card>
                                    <div className="h-80" />
                                </Card>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </main>
        </PitwallSession>
    )
}