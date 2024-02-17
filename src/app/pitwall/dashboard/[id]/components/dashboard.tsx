"use client";

import { MultiClassDetails } from "@/components/car-class-details/multi-class";
import { SingleClassDetails } from "@/components/car-class-details/single-class";
import { SourceSelection } from "@/components/connection/source-selection";
import FuelAnalysis from "@/components/fuel/fuel-analysis";
import { Session } from "@/components/session/session";
import { Standings } from "@/components/standings/standings";
import Telemetry from "@/components/telemetry/car-telemetry";
import InputTelemetry from "@/components/telemetry/input-telemetry";
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
          data-grid={{ x: 0, y: 2, w: 4, h: 2, minH: 1 }}
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
          data-grid={{ x: 0, y: 4, w: 4, h: 2, minH: 2 }}
        >
          <DashboardCard title="Track Map">
            <TrackMap />
          </DashboardCard>
        </div>
        <div
          key="standings"
          className="overflow-hidden"
          data-grid={{ x: 4, y: 2, w: 8, h: 8, minH: 2 }}
        >
          <DashboardCard title="Standings">
            <Standings />
          </DashboardCard>
        </div>
        <div
          key="currentLap"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 8, w: 4, h: 1 }}
        >
          <DashboardCard title="Current Lap">
            <Timing />
          </DashboardCard>
        </div>
        <div
          key="cartTelemetry"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 9, w: 4, h: 1 }}
        >
          <DashboardCard title="Car Telemetry">
            <Telemetry />
          </DashboardCard>
        </div>
        <div
          key="inputTelemetry"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 9, w: 4, h: 1 }}
        >
          <DashboardCard title="Input Telemetry">
            <InputTelemetry />
          </DashboardCard>
        </div>
        <div
          key="fuelAnalysis"
          className="overflow-hidden"
          data-grid={{ x: 0, y: 11, w: 4, h: 3 }}
        >
          <DashboardCard title="Fuel Analysis">
            <FuelAnalysis />
          </DashboardCard>
        </div>
      </ResponsiveGridLayout>
    </main>
  );
}
