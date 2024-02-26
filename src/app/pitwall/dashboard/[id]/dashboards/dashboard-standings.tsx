"use client";

import { MultiClassDetails } from "@/components/car-class-details/multi-class";
import { SingleClassDetails } from "@/components/car-class-details/single-class";
import { Standings } from "@/components/standings/standings";
import { TrackMap } from "@/components/trackmap/trackmap";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useState } from "react";
import { Layout } from "react-grid-layout";
import Dashboard from "../components/dashboard";
import { DashboardCard } from "../components/dashboard-card";
import { DashboardComponent } from "../components/dashboard-component";

const STORAGE_KEY: string = "dashboard_standings_layout";

export default function DashboardStandings() {
  const session = useSelector(selectCurrentTrackSession);
  const [carClassTitle, setCarClassTitle] = useState("");

  const defaultLayout: Layout[] = [
    { i: "carClassDetails", x: 0, y: 2, w: 4, h: 2, minH: 1 },
    { i: "trackMap", x: 0, y: 4, w: 4, h: 4, minH: 2 },
    { i: "standings", x: 4, y: 2, w: 8, h: 8, minH: 2 },
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
  ];

  return (
    <Dashboard
      storageKey={STORAGE_KEY}
      defaultLayout={defaultLayout}
      components={components}
    />
  );
}
