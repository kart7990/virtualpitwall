"use client";

import { useEffect, useState } from "react";
import ReactGridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { DashboardComponent } from "../components/dashboard-component";

const ResponsiveGridLayout = WidthProvider(ReactGridLayout);

export default function Dashboard({
  defaultLayout,
  components,
  storageKey,
}: {
  defaultLayout: Layout[];
  components: DashboardComponent[];
  storageKey: string;
}) {
  const [layout, setLayout] = useState<Layout[]>();

  useEffect(() => {
    let savedLayoutJson = localStorage.getItem(storageKey);
    if (savedLayoutJson != null) {
      let savedLayout: Layout[] = JSON.parse(savedLayoutJson);
      setLayout(savedLayout);
    } else {
      setLayout(defaultLayout);
    }
  }, [defaultLayout, storageKey]);

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
    localStorage.setItem(storageKey, JSON.stringify(layout));
  };

  return (
    <>
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
