"use client";
import {
  useSelector,
  selectLiveTiming,
  LiveTiming,
  standingsSlice,
  useDispatch,
  selectCurrentSession,
} from "@/lib/redux";
import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_RowSelectionState,
  MRT_Row,
} from "material-react-table";

import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { convertMsToDisplay } from "../utils/formatter/UnitConversion";
import tinycolor from "tinycolor2";

export const Standings = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState<LiveTiming[]>([]);
  const standingsData = useSelector<LiveTiming[]>(selectLiveTiming);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const session = useSelector(selectCurrentSession);

  useEffect(() => {
    setData(standingsData);
  }, [standingsData]);

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          background: {
            default: "rgb(254,255,244, 0)",
          },
        },
      }),
    [],
  );
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<LiveTiming>[]>(
    () => [
      {
        accessorKey: "position",
        header: "Pos.",
        size: 70,
        enableColumnOrdering: false,
      },
      {
        accessorKey: "classPosition",
        header: "classPosition",
        size: 1,
      },
      {
        accessorKey: "carNumber",
        header: "Car #",
        size: 80,
        enableColumnOrdering: false,
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 150,
      },
      {
        accessorKey: "leaderDelta",
        header: "Gap",
        size: 100,
        enableSorting: false,
      },
      {
        accessorKey: "nextCarDelta",
        header: "Int",
        size: 100,
        enableSorting: false,
      },
      {
        accessorKey: "lastLaptime",
        header: "Last Laptime",
        size: 150,
        Cell: ({ cell }) => convertMsToDisplay(cell.getValue()),
      },
      {
        accessorKey: "bestLaptime",
        header: "Best Laptime",
        size: 150,
        Cell: ({ cell }) => convertMsToDisplay(cell.getValue()),
      },
      {
        accessorKey: "teamName",
        header: "teamName",
        size: 150,
      },
      {
        accessorKey: "lap",
        header: "Lap #",
        size: 60,
        enableColumnOrdering: false,
        enableSorting: false,
      },
      {
        accessorKey: "pitStopCount",
        header: "Pit Stop #",
        size: 85,
        enableColumnOrdering: false,
        enableSorting: false,
      },
      {
        accessorKey: "stintLapCount",
        header: "Stint Laps",
        size: 99,
        enableColumnOrdering: false,
        enableSorting: false,
      },
      {
        accessorKey: "standingPosition", //normal accessorKey
        header: "standingPosition",
        size: 200,
      },
      {
        accessorKey: "standingClassPosition",
        header: "standingClassPosition",
        size: 150,
      },
      {
        accessorKey: "className",
        header: "className",
        size: 150,
      },
      {
        accessorKey: "iRating",
        header: "iRating",
        size: 150,
      },
      {
        accessorKey: "safetyRating",
        header: "safetyRating",
        size: 150,
      },
      {
        accessorKey: "driverShortName",
        header: "driverShortName",
        size: 150,
      },
    ],
    [],
  );

  // Store the selected car in the state so that we can show it in other components
  useEffect(() => {
    const keys = Object.keys(rowSelection);
    const value = keys !== undefined ? keys[0] : undefined;
    dispatch(standingsSlice.actions.updateSelectedCar(value));
  }, [dispatch, rowSelection]);

  // Set the background color of the rows to the multiclass color, when in a multiclass race
  const getRowSx = (row: MRT_Row<LiveTiming>) => {
    const classColor = tinycolor(row.original.classColor);
    classColor.setAlpha(0.1);

    const backgroundColorStyle = session?.isMulticlass
      ? { backgroundColor: classColor.toHex8String() }
      : {};

    const res = {
      cursor: "pointer",
      ...backgroundColorStyle,
    };

    return res;
  };

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    initialState: {
      density: "compact",
      columnVisibility: {
        "mrt-row-select": false, //hide select column
        classPosition: false,
        standingPosition: false,
        standingClassPosition: false,
        className: false,
        iRating: false,
        safetyRating: false,
        driverShortName: false,
        teamName: false,
        lap: true,
        pitStopCount: true,
        stintLapCount: true,
      },
      sorting: [
        {
          id: "position", //sort by age by default on page load
          desc: false,
        },
      ],
    },
    getRowId: (row) => row.carNumber,
    enableColumnOrdering: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableColumnResizing: true,
    enablePagination: false,
    enableSorting: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    positionToolbarAlertBanner: "none",
    muiTableBodyRowProps: ({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
      sx: getRowSx(row),
    }),
  });
  return (
    <div className="h-full overflow-auto">
      <ThemeProvider theme={tableTheme}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
    </div>
  );
};
