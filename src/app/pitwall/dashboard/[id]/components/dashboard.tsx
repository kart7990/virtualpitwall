"use client";

import { MultiClassDetails } from "@/components/car-class-details/multi-class";
import { SingleClassDetails } from "@/components/car-class-details/single-class";
import { Conditions } from "@/components/conditions/conditions";
import { SourceSelection } from "@/components/connection/source-selection";
import { Session } from "@/components/session/session";
import { Standings } from "@/components/standings/standings";
import Timing from "@/components/timing/current-lap";
import { TrackMap } from "@/components/trackmap/trackmap";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useState } from "react";
import GridLayout, { ItemCallback, WidthProvider } from "react-grid-layout";
import { DashboardCard } from "./dashboard-card";
import { DashboardHeader } from "./dashboard-header";

const ResponsiveGridLayout = WidthProvider(GridLayout);

export default function Dashboard() {
  const session = useSelector(selectCurrentTrackSession);
  const [carClassTitle, setCarClassTitle] = useState("");

  const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
    console.log("Grid-RESIZE", newItem.i);
  };

  return (
    <main className="text-sm">
      <DashboardHeader
        left={<SourceSelection />}
        right={<Session />}
      ></DashboardHeader>
      <ResponsiveGridLayout
        className="layout"
        isDraggable={true}
        isResizable={true}
        draggableHandle=".drag-handle"
        onResizeStop={onResizeStopped}
        resizeHandles={["se"]}
      >
        <div
          key="carClasses"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 2, w: 3, h: 2, minH: 1 }}
        >
          <DashboardCard title={carClassTitle}>
            {session?.isMulticlass ? (
              <MultiClassDetails setCarClassTitle={setCarClassTitle} />
            ) : (
              <SingleClassDetails setCarClassTitle={setCarClassTitle} />
            )}
          </DashboardCard>
        </div>
        <div
          key="trackMap"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 4, w: 3, h: 2, minH: 2 }}
        >
          <DashboardCard title="Track Map">
            <TrackMap />
          </DashboardCard>
        </div>
        <div
          key="standings"
          className="overflow-hidden"
          data-grid={{ x: 3, y: 2, w: 9, h: 8, minH: 2 }}
        >
          <DashboardCard title="Standings">
            <Standings />
          </DashboardCard>
        </div>
        <div key="b" data-grid={{ x: 0, y: 6, w: 3, h: 2, minW: 2, maxW: 4 }}>
          <DashboardCard title="Conditions">
            <Conditions />
          </DashboardCard>
        </div>
        <div
          key="currentLap"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 8, w: 3, h: 2 }}
        >
          <DashboardCard title="Current Lap">
            <Timing />
          </DashboardCard>
        </div>
      </ResponsiveGridLayout>
    </main>
  );
}
