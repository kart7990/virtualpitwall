"use client";

import FuelAnalysis from "@/components/core/ui/tabs";
import Telemetry from "@/components/telemetry/car-telemetry";
import InputTelemetry from "@/components/telemetry/input-telemetry";
import Timing from "@/components/timing/current-lap";
import { useEffect, useState } from "react";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { DashboardCard } from "./dashboard-card";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const STORAGE_KEY: string = "dashboard_telemetry_layout";

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

export default function DashboardTiming() {
  const [layout, setLayout] = useState<Layout[]>();

  const defaultLayout: Layout[] = [
    { i: "currentLap", x: 0, y: 8, w: 4, h: 1 },
    { i: "carTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "inputTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "fuelAnalysis", x: 0, y: 11, w: 4, h: 3 },
  ];

  let components: DashboardComponent[] = [
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
          <FuelAnalysis defaultTab={""} tabs={[]} />
        </DashboardCard>
      ),
    ),
  ];

  useEffect(() => {
    let savedLayoutJson = localStorage.getItem(STORAGE_KEY);
    if (savedLayoutJson != null) {
      let savedLayout: Layout[] = JSON.parse(savedLayoutJson);
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
