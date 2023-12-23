'use client'
import { StatusOnlineIcon } from "@heroicons/react/outline";
import {
    useSelector,
    selectLiveTimimg,
    LiveTiming,
} from '@/lib/redux'
import { useMemo, useState, useEffect } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';

import { createTheme, ThemeProvider, useTheme } from '@mui/material';


export const Standings = () => {
    const [data, setData] = useState<LiveTiming[]>([]);
    const standingsData = useSelector<LiveTiming[]>(selectLiveTimimg)

    useEffect(() => {
        setData(standingsData)
     },[standingsData])

    const tableTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: "dark",
                    background: {
                        default: 'rgb(254,255,244, 0)'
                    }
                }
            }),
        [],
    );
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<LiveTiming>[]>(
        () => [
            {
                accessorKey: "position",
                header: 'Position',
                size: 150
            },
            {
                accessorKey: 'classPosition',
                header: 'classPosition',
                size: 150,
            },
            {
                accessorKey: 'standingPosition', //normal accessorKey
                header: 'standingPosition',
                size: 200,
            },
            {
                accessorKey: 'standingClassPosition',
                header: 'standingClassPosition',
                size: 150,
            },
            {
                accessorKey: 'carNumber',
                header: 'carNumber',
                size: 150,
            },
            {
                accessorKey: 'className',
                header: 'className',
                size: 150,
            },
            {
                accessorKey: 'iRating',
                header: 'iRating',
                size: 150,
            },
            {
                accessorKey: 'safetyRating',
                header: 'safetyRating',
                size: 150,
            },
            {
                accessorKey: 'driverName',
                header: 'driverName',
                size: 150,
            },
            {
                accessorKey: 'driverShortName',
                header: 'driverShortName',
                size: 150,
            },
            {
                accessorKey: 'teamName',
                header: 'teamName',
                size: 150,
            },
            {
                accessorKey: 'leaderDelta',
                header: 'leaderDelta',
                size: 150,
            },
            {
                accessorKey: 'nextCarDelta',
                header: 'nextCarDelta',
                size: 150,
            },
            {
                accessorKey: 'lastLaptime',
                header: 'lastLaptime',
                size: 150,
            },
            {
                accessorKey: 'bestLaptime',
                header: 'bestLaptime',
                size: 150,
            },
            {
                accessorKey: 'lap',
                header: 'lap',
                size: 150,
            },
            {
                accessorKey: 'pitStopCount',
                header: 'pitStopCount',
                size: 150,
            },
            {
                accessorKey: 'stintLapCount',
                header: 'stintLapCount',
                size: 150,
            }
        ],
        [],
    );
(console.log('DH-STANDINGDATA', standingsData))
    const table = useMaterialReactTable({
        columns,
        standingsData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableColumnOrdering: true,
        initialState: {
            density: 'compact',
            columnVisibility: {
                'mrt-row-select': false, //hide select column
            },
        },
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        enableRowSelection: true,
        enableMultiRowSelection: false,
        enableFullScreenToggle: false,
        enableDensityToggle: false,
        positionToolbarAlertBanner: 'none',
        muiTableBodyRowProps: ({ row }) => ({
            onClick: row.getToggleSelectedHandler(),
            sx: { cursor: 'pointer' },
        }),
    });
    return (
        <ThemeProvider theme={tableTheme}>
            <MaterialReactTable table={table} />
        </ThemeProvider>
    );
}