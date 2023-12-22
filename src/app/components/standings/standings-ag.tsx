import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import './style.css'


import {
    useSelector,
    selectLiveTimimg,
    LiveTiming,
} from '@/lib/redux'
import { useMemo, useState, useEffect } from 'react';

export const Standings = () => {
    const [data, setData] = useState<LiveTiming[]>([]);
    const standingsData: LiveTiming[] = useSelector(selectLiveTimimg)

    useEffect(() => {
        setData(standingsData)
    }, [standingsData])

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState([
        { field: "position" },
        { field: "classPosition" },
        { field: "standingPosition" },
        { field: "carNumber" },
        { field: "leaderDelta" },
        { field: "nextCarDelta" },
        { field: "stintLapCount" }
    ]);


    return (
        <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
            <AgGridReact rowData={standingsData} columnDefs={colDefs} />
        </div>
    );
}