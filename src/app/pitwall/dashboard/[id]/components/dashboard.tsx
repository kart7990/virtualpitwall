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
import { useEffect, useState } from "react";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { DashboardCard } from "./dashboard-card";
import { DashboardHeader } from "./dashboard-header";

const ResponsiveGridLayout = WidthProvider(GridLayout);

const STORAGE_KEY: string = "dashboard_defaultLayout";

class DashboardComponent {
  public id: string;
  public content: React.ReactNode;
  public title: string;
  public description: string;

  constructor(
    id: string,
    title: string,
    description: string,
    content: React.ReactNode,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.content = content;
  }
}

export default function Dashboard() {
  const session = useSelector(selectCurrentTrackSession);
  const [carClassTitle, setCarClassTitle] = useState("");
  const [layout, setLayout] = useState<Layout[]>();

  const defaultLayout: Layout[] = [
    { i: "carClassDetails", x: 0, y: 2, w: 4, h: 2, minH: 1 },
    { i: "trackMap", x: 0, y: 4, w: 4, h: 2, minH: 2 },
    { i: "standings", x: 4, y: 2, w: 8, h: 8, minH: 2 },
    { i: "currentLap", x: 0, y: 8, w: 4, h: 1 },
    { i: "carTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "inputTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "fuelAnalysis", x: 0, y: 11, w: 4, h: 3 },
  ];

  let components: DashboardComponent[] = [
    new DashboardComponent(
      "carClassDetails",
      "Class Details",
      "Displays session details about each car and car classes.",
      (
        <DashboardCard title={carClassTitle}>
          {session?.isMulticlass ? (
            <MultiClassDetails setCarClassTitle={setCarClassTitle} />
          ) : (
            <SingleClassDetails setCarClassTitle={setCarClassTitle} />
          )}
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "trackMap",
      "Track Map",
      "Displays an interactive track map.",
      (
        <DashboardCard title="Track Map">
          <TrackMap />
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "standings",
      "Standings",
      "Displays live timing and standings.",
      (
        <DashboardCard title="Standings">
          <Standings />
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "currentLap",
      "Current Lap Details",
      "Displays details about the current lap.",
      (
        <DashboardCard title="Current Lap">
          <Timing />
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "carTelemetry",
      "Car Telemetry",
      "Displays car telemetry.",
      (
        <DashboardCard title="Car Telemetry">
          <Telemetry />
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "inputTelemetry",
      "Input Telemetry",
      "Displays input telemetry.",
      (
        <DashboardCard title="Input Telemetry">
          <InputTelemetry />
        </DashboardCard>
      ),
    ),
    new DashboardComponent(
      "fuelAnalysis",
      "Fuel Analysis",
      "Displays fuel analysis.",
      (
        <DashboardCard title="Fuel Analysis">
          <FuelAnalysis />
        </DashboardCard>
      ),
    ),
  ];

  useEffect(() => {
    let savedLayoutJson = localStorage.getItem(STORAGE_KEY);
    if (savedLayoutJson != null) {
      let savedLayout: Layout[] = JSON.parse(savedLayoutJson);
      console.log("savedLayout", savedLayout);
      setLayout(savedLayout);
    } else {
      setLayout(defaultLayout);
    }
  }, []);

  function renderComponents() {
    return layout?.map((layoutItem) => (
      <div
        key={layoutItem.i}
        data-grid={layoutItem}
        className="overflow-hidden"
      >
        {components.find((c) => c.id === layoutItem.i)?.content}
      </div>
    ));
  }

  const onLayoutChange = (layout: Layout[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  };

  return (
    <>
      {console.log("render", layout)}
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
          onLayoutChange={onLayoutChange}
          resizeHandles={["se"]}
        >
          {renderComponents()}
        </ResponsiveGridLayout>
      </main>
    </>
  );
}
