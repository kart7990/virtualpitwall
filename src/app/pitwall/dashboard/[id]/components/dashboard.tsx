"use client";

import { DashboardCard } from "./dashboard-card";
import { CarClass } from "@/components/car-classes/car-class";
import { CarClasses } from "@/components/car-classes/car-classes";
import { Conditions } from "@/components/conditions/conditions";
import { Session } from "@/components/session/session";
import { Standings } from "@/components/standings/standings";
import { TrackMap } from "@/components/trackmap/trackmap";
import { selectCurrentSession, useSelector } from "@/lib/redux";
import GridLayout, { ItemCallback, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(GridLayout);

export default function Dashboard() {
  const session = useSelector(selectCurrentSession);

  const onResizeStopped: ItemCallback = (layout, oldItem, newItem) => {
    console.log("Grid-RESIZE", newItem.i);
  };

  const carClassesTitle = session?.isMulticlass
    ? "Car Classes Details"
    : "Car Class Details";

  return (
    <main>
      <ResponsiveGridLayout
        className="layout"
        isDraggable={true}
        isResizable={true}
        draggableHandle=".drag-handle"
        onResizeStop={onResizeStopped}
        resizeHandles={["se"]}
      >
        <div
          key="sessionDetails"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 0, w: 12, h: 1 }}
        >
          <DashboardCard title="Session Details">
            <Session />
          </DashboardCard>
        </div>
        <div
          key="carClasses"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 2, w: 3, h: 2, minH: 2 }}
        >
          <DashboardCard title={carClassesTitle}>
            {session?.isMulticlass ? <CarClasses /> : <CarClass />}
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
          data-grid={{ x: 3, y: 2, w: 9, h: 7, minH: 2 }}
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
      </ResponsiveGridLayout>
    </main>
  );
}
