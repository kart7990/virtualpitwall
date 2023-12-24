"use client"

import './style.css'
import PitwallSession from '@/app/components/connection/pitwallSession';
import { Standings } from '@/app/components/standings/standings';
import { TrackMap } from '@/app/components/trackmap/trackmap';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons";

import GridLayout, { ItemCallback, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(GridLayout);



export default function Page({ params }: { params: { id: string } }) {
    const pitboxSessionId = params.id
    console.log(pitboxSessionId)

    // #endregion
    const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
        console.log('DH-Grid-RESIZE', newItem.i)
    };

    return (
        <PitwallSession pitwallSessionId={pitboxSessionId}>
            <main>
                <ResponsiveGridLayout className="layout" isDraggable={true} isResizable={true} draggableHandle='.drag-handle' onResizeStop={onResizeStopped} resizeHandles={["se"]}>
                    <div key="trackMap" className="overflow-hidden" data-grid={{ x: 0, y: 0, w: 3, h: 3, minH: 2 }}>
                        <Card className="h-full">
                            <CardHeader className="border-b p-3 drag-handle">
                                <CardTitle className="m-0">Track Map</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TrackMap />
                            </CardContent>
                        </Card>
                    </div>
                    <div key="standings" className="overflow-hidden" data-grid={{ x: 3, y: 0, w: 5, h: 3, minH: 2 }}>
                        <Card className="h-full">
                            <CardHeader className="border-b p-3 drag-handle">
                                <CardTitle className="m-0">Standings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 w-full h-full">
                                <Standings />
                            </CardContent>
                        </Card>
                    </div>
                    <div key="b" data-grid={{ x: 0, y: 3, w: 3, h: 2, minW: 2, maxW: 4 }}>
                    <Card className="h-full">
                            <CardHeader className="border-b p-3 drag-handle">
                                <CardTitle className="m-0">Card</CardTitle>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </div>
                </ResponsiveGridLayout>
            </main>
        </PitwallSession>
    )
}