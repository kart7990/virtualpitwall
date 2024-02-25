"use client";

import { MultiClassDetails } from "@/components/car-class-details/multi-class";
import { SingleClassDetails } from "@/components/car-class-details/single-class";
import { Standings } from "@/components/standings/standings";
import { TrackMap } from "@/components/trackmap/trackmap";
import { selectCurrentTrackSession, useSelector } from "@/lib/redux";
import { useEffect, useState } from "react";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { DashboardCard } from "./dashboard-card";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

const STORAGE_KEY: string = "dashboard_standings_layout";

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

export default function DashboardStandings() {
  const session = useSelector(selectCurrentTrackSession);
  const [carClassTitle, setCarClassTitle] = useState("");
  const [layout, setLayout] = useState<Layout[]>();

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
