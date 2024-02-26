"use client";

import FuelAnalysis from "@/components/fuel/fuel-analysis";
import Telemetry from "@/components/telemetry/car-telemetry";
import InputTelemetry from "@/components/telemetry/input-telemetry";
import Timing from "@/components/timing/current-lap";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import Dashboard from "../components/dashboard";
import { DashboardCard } from "../components/dashboard-card";
import { DashboardComponent } from "../components/dashboard-component";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const STORAGE_KEY: string = "dashboard_telemetry_layout";

export default function DashboardTiming() {
  const defaultLayout: Layout[] = [
    { i: "currentLap", x: 0, y: 0, w: 4, h: 1 },
    { i: "carTelemetry", x: 0, y: 1, w: 4, h: 1 },
    { i: "inputTelemetry", x: 0, y: 2, w: 4, h: 1 },
    { i: "fuelAnalysis", x: 4, y: 0, w: 4, h: 3 },
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
          <FuelAnalysis />
        </DashboardCard>
      ),
    ),
  ];

  return (
    <Dashboard
      storageKey={STORAGE_KEY}
      defaultLayout={defaultLayout}
      components={components}
    />
  );
}
