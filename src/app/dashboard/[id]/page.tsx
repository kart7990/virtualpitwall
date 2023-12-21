"use client"
import GridLayout, { ItemCallback } from "react-grid-layout"

import PitwallSession from '@/app/components/connection/pitwallSession';
import { Standings } from '@/app/components/standings/standings';
import { TrackMap } from '@/app/components/trackmap/trackmap';
import { Button } from "@/components/ui/button"



export default function Page({ params }: { params: { id: string } }) {
    const pitboxSessionId = params.id
    console.log(pitboxSessionId)

    // #endregion
    const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
        console.log('DH-Grid-RESIZE', newItem.i)
    };

    return (
        <PitwallSession pitwallSessionId={pitboxSessionId}>
            <main className="p-12">

                <GridLayout className="layout" cols={12} rowHeight={30} width={4000} onResizeStop={onResizeStopped}>
                    <div key="standings" data-grid={{ x: 2, y: 0, w: 3, h: 15, minH: 6 }}>
                        <Standings />
                    </div>
                    <div key="trackMap" data-grid={{ x: 0, y: 3, w: 2, h: 15, minH: 6 }}>
                        <TrackMap />
                    </div>
                    <div key="b" data-grid={{ x: 0, y: 5, w: 3, h: 2, minW: 2, maxW: 4 }}>

                        <Button>Click me</Button>
                    </div>
                </GridLayout>
            </main>
        </PitwallSession>
    )
}