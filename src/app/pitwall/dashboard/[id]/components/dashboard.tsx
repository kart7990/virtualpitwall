"use client";

import { DashboardCard } from "./dashboard-card";
import { MultiClassDetails } from "@/components/car-class-details/multi-class";
import { SingleClassDetails } from "@/components/car-class-details/single-class";
import { Conditions } from "@/components/conditions/conditions";
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
    ? "Multi-Class Details"
    : "Single-Class Details";

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
          key="carClasses"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 2, w: 3, h: 2, minH: 2 }}
        >
          <DashboardCard title={carClassesTitle}>
            {session?.isMulticlass ? (
              <MultiClassDetails />
            ) : (
              <SingleClassDetails />
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
