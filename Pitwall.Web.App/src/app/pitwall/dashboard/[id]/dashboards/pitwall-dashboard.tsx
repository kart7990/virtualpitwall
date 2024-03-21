"use client";

import { SourceSelection } from "@/components/connection/source-selection";
import Tabs, { TabProps } from "@/components/core/ui/tabs";
import { Session } from "@/components/session/session";
import LapComparison from "@/components/timing/lap-comparison";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useState } from "react";
import { Layout } from "react-grid-layout";
import { DashboardHeader } from "../components/dashboard-header";
import DashboardStandings from "./dashboard-standings";
import DashboardTelemetry from "./dashboard-telemetry";

export default function PitwallDashboard() {
  const session = useSelector(selectCurrentTrackSession);
  const [carClassTitle, setCarClassTitle] = useState("");
  const [layout, setLayout] = useState<Layout[]>();

  const tabs: TabProps[] = [
    {
      value: "Dashboard",
      content: <DashboardStandings />,
    },
    {
      value: "Telemetry",
      content: <DashboardTelemetry />,
    },
    {
      value: "Lap Comparison",
      content: <LapComparison />,
    },
  ];

  return (
    <main className="text-sm">
      <DashboardHeader
        left={<SourceSelection />}
        right={<Session />}
      ></DashboardHeader>
      <Tabs defaultTab="Dashboard" tabs={tabs} />
    </main>
  );
}
