import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  createGrid,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "./style.css";

import { useSelector, selectLiveTiming, LiveTiming } from "@/lib/redux";
import { useMemo, useState, useRef, useCallback } from "react";

export const Standings = () => {
  const gridRef = useRef<AgGridReact<LiveTiming>>(null);
  const [selectedCar, setSelectedCar] = useState<string>();
  const standingsData: LiveTiming[] = useSelector(selectLiveTiming);

  const [columnDefs, setColumnDefs] = useState<ColDef<LiveTiming>[]>([
    { field: "position" },
    { field: "carNumber" },
    { field: "driverName", minWidth: 150 },
    { field: "leaderDelta", maxWidth: 100 },
    { field: "nextCarDelta", maxWidth: 100 },
    { field: "bestLaptime", maxWidth: 100 },
    { field: "lastLaptime", maxWidth: 100 },
    { field: "lap" },
    { field: "pitStopCount" },
    { field: "stintLapCount" },
    { field: "iRating" },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 50,
    };
  }, []);

  const onSelectionChanged = useCallback(() => {
    console.log("onselectionchange");
    const selectedRows = gridRef.current!.api.getSelectedRows();
    if (selectedRows[0]) {
      setSelectedCar(selectedRows[0].carNumber);
    }
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log("onGridReady");
    // placing in 13 rows, so there are exactly enough rows to fill the grid, makes
    // the row animation look nice when you see all the rows
  }, []);

  return (
    <div
      className="ag-theme-quartz-dark h-full w-full"
      style={{ width: "100%", height: "100%" }}
    >
      <AgGridReact<LiveTiming>
        ref={gridRef}
        rowData={standingsData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={30}
        animateRows={false}
        rowSelection={"single"}
        onSelectionChanged={onSelectionChanged}
        onGridReady={onGridReady}
        onRowDataUpdated={(p) => {
          console.log("update");
          if (selectedCar) {
            p.api.forEachNode(function (node) {
              if (node.data!.carNumber === selectedCar) {
                node.setSelected(true);
              } else {
                node.setSelected(false);
              }
            });
          }
        }}
      />
    </div>
  );
};
