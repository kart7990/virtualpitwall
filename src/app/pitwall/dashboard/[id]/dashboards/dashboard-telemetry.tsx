"use client";

import FuelAnalysis from "@/components/core/ui/tabs";
import Telemetry from "@/components/telemetry/car-telemetry";
import InputTelemetry from "@/components/telemetry/input-telemetry";
import Timing from "@/components/timing/current-lap";
import { useState } from "react";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import Dashboard from "../components/dashboard";
import { DashboardCard } from "../components/dashboard-card";
import { DashboardComponent } from "../components/dashboard-component";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const STORAGE_KEY: string = "dashboard_telemetry_layout";

export default function DashboardTiming() {
  const [layout, setLayout] = useState<Layout[]>();

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

  const defaultLayout: Layout[] = [
    { i: "currentLap", x: 0, y: 8, w: 4, h: 1 },
    { i: "carTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "inputTelemetry", x: 0, y: 9, w: 4, h: 1 },
    { i: "fuelAnalysis", x: 0, y: 11, w: 4, h: 3 },
  ];

  return (
    <Dashboard
      storageKey={STORAGE_KEY}
      defaultLayout={defaultLayout}
      components={components}
    />
  );
}
