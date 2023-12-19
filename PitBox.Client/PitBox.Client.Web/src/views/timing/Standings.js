import './Standings.css'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { convertMsToDisplay } from '../../formatters/UnitConversion'
import { setSelectedCar } from '../../containers/pitbox/standings/StandingsActions';

import {
    CCol,
    CDataTable,
    CRow
} from '@coreui/react'

const Standings = () => {
    const dispatch = useDispatch()
    const standings = useSelector(state => state.pitboxSession.eventDetails.standings)
    const pitboxSessionNumber = useSelector(state => state.pitboxSession.eventDetails.currentTrackSessionNumber)
    const currentPitboxSession = useSelector(state => state.pitboxSession.eventDetails.trackSessions.find(ts => ts.sessionNumber === pitboxSessionNumber))
    const isMulticlass = currentPitboxSession?.isMulticlass
    const isPractice = currentPitboxSession?.isPractice
    const isQualify = currentPitboxSession?.isQualify
    const standingsSelectedCarNumber = useSelector(state => state.pitboxSession.standingsSelectedCarNumber)
    const [sorterCol, setSorterCol] = useState();
    const isRace = () => { return !isPractice && !isQualify }

    useEffect(() => {
        setSorterCol({ column: isQualify || isPractice ? 'standingPosition' : 'position', asc: 'true' })
    }, [isPractice, isQualify])

    const fields = [
        isRace() ? 'position' : { key: 'standingPosition', label: 'Standing' },
        { key: 'carNumber', label: 'Car #', sorter: false },
        'name',
        ...isRace() ? ['leaderGap'] : [],
        ...isRace() ? ['gap'] : [],
        { key: 'bestLaptime', sorter: false },
        { key: 'lastLaptime', sorter: false },
        { key: 'lap', sorter: false },
        'pitStops',
        'stintLaps',
        { key: 'iRating', label: 'iRating' }
    ]


    const multiclassFields = [
        isRace() ? 'position' : { key: 'standingPosition', label: 'Standing', sort: true },
        ...isRace() ? [{ key: 'classPosition', sorter: false }] : [],
        { key: 'classColor', label: 'Class' },
        { key: 'carNumber', label: 'Car #', sorter: false },
        'name',
        ...isRace() ? ['leaderGap'] : [],
        ...isRace() ? ['gap'] : [],
        { key: 'bestLaptime', sorter: false },
        { key: 'lastLaptime', sorter: false },
        { key: 'lap', sorter: false },
        'pitStops',
        'stintLaps',
        { key: 'iRating', label: 'iRating' }
    ]

    const scopedSlots = {
        'name':
            (item) => (
                <td>
                    {!item.isCurrentDriver ?
                        <span>{item.driverShortName}</span>
                        :
                        <span style={{ color: '#45a164' }}>{item.driverShortName}</span>
                    }
                </td>
            ),
        'leaderGap':
            (item) => (
                <td>
                    {item.leaderDelta}
                </td>
            ),
        'gap':
            (item) => (
                <td>
                    {item.nextCarDelta}
                </td>
            ),
        'lastLaptime':
            (item) => (
                <td>
                    {convertMsToDisplay(item.lastLaptime)}
                </td>
            ),
        'bestLaptime':
            (item) => (
                <td>
                    {convertMsToDisplay(item.bestLaptime)}
                </td>
            ),
        'pitStops':
            (item) => (
                <td>
                    {item.pitStopCount}
                </td>
            ),
        'stintLaps':
            (item) => (
                <td>
                    {item.stintLapCount}
                </td>
            )
    }

    const multiclassSlots = {
        ...scopedSlots,
        'classColor':
            (item) => (
                <td>
                    <div className="color-box" style={{ backgroundColor: item.classColor.slice(0, -2) + 'B3' }}></div>
                </td>
            )
    }


    return (
        <>
            {standings != null &&
                <CRow>
                    <CCol>
                        <CDataTable
                            items={standings.sort((a, b) => parseFloat(a.position) - parseFloat(b.position))}
                            fields={isMulticlass ? multiclassFields : fields}
                            hover
                            clickableRows
                            sorter
                            sorterValue={sorterCol}
                            size="sm"
                            scopedSlots={isMulticlass ? multiclassSlots : scopedSlots}
                            itemsPerPage={20}
                            pagination
                            onRowClick={(item) => {
                                if (standingsSelectedCarNumber !== item.carNumber) {
                                    dispatch(setSelectedCar(item.carNumber))
                                } else {
                                    dispatch(setSelectedCar(-1))
                                }
                            }}
                        />
                    </CCol>
                </CRow>
            }
        </>
    )
}

export default Standings
