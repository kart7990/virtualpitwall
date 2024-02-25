"use client";

import { SourceSelection } from "@/components/connection/source-selection";
import Tabs, { TabProps } from "@/components/core/ui/tabs";
import { Session } from "@/components/session/session";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useState } from "react";
import { Layout } from "react-grid-layout";
import { DashboardHeader } from "./dashboard-header";
import DashboardStandings from "./dashboard-standings";
import DashboardTelemetry from "./dashboard-telemetry";

const STORAGE_KEY: string = "dashboard_layout";

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

  const tabs: TabProps[] = [
    {
      value: "Dashboard",
      content: <DashboardStandings />,
    },
    {
      value: "Telemetry",
      content: <DashboardTelemetry />,
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
