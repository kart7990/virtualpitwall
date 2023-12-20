"use client"
import { Card, Grid, Tab, TabGroup, Metric, Flex, ProgressBar, TabList, TabPanel, TabPanels, Text, Title, } from "@tremor/react"
import GridLayout from "react-grid-layout"
import { API_BASE_URL } from "@/config/domain.config"

export default function Page() {
    console.log(API_BASE_URL)
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
                        <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
                            <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2 }}>
                                <Card className="h-full">
                                </Card>
                            </div>
                            <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>
                                <Card className="h-full">
                                </Card>
                            </div>
                            <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }}>
                                <Card className="h-full overflow-hidden">
                                    <Text>Sales</Text>
                                    <Metric>$ 71,465</Metric>
                                    <Flex className="mt-4">
                                        <Text>32% of annual target</Text>
                                        <Text>$ 225,000</Text>
                                    </Flex>
                                    <ProgressBar value={32} className="mt-2" />
                                </Card>
                            </div>
                        </GridLayout>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </main>
    )
}