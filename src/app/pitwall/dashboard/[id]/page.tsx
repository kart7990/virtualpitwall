"use client"

import './style.css'
import PitwallSession from '@/components/connection/pitwall-session';
import { Standings } from '@/components/standings/standings';
import { TrackMap } from '@/components/trackmap/trackmap';
import GridLayout, { ItemCallback, WidthProvider } from "react-grid-layout";
import { Conditions } from '@/components/conditions/conditions';
import { DashboardCard } from './components/dashboard-card';

const ResponsiveGridLayout = WidthProvider(GridLayout);



export default function Page({ params }: { params: { id: string } }) {
    const pitboxSessionId = params.id

    // #endregion
    const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
        console.log('Grid-RESIZE', newItem.i)
    };

    return (
        <PitwallSession pitwallSessionId={pitboxSessionId}>
            <main>
                <ResponsiveGridLayout className="layout" isDraggable={true} isResizable={true} draggableHandle='.drag-handle' onResizeStop={onResizeStopped} resizeHandles={["se"]}>
                    <div key="trackMap" className="overflow-hidden" data-grid={{ x: 0, y: 0, w: 3, h: 3, minH: 2 }}>
                        <DashboardCard title='Track Map'>
                            <TrackMap />
                        </DashboardCard>
                    </div>
                    <div key="standings" className="overflow-hidden" data-grid={{ x: 3, y: 0, w: 5, h: 3, minH: 2 }}>
                        <DashboardCard title='Standings'>
                            <Standings />
                        </DashboardCard>
                    </div>
                    <div key="b" data-grid={{ x: 0, y: 3, w: 3, h: 2, minW: 2, maxW: 4 }}>
                        <DashboardCard title='Conditions'>
                            <Conditions/>
                        </DashboardCard>
                    </div>
                </ResponsiveGridLayout>
            </main>
        </PitwallSession>
    )
}