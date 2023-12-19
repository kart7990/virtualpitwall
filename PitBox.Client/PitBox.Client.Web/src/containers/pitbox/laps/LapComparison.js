import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    CCol,
    CRow,
    CSelect
} from '@coreui/react'
import LapHistory from './LapHistory'

import { currentSessionLaps, eventSessionNumbersTypesAndLaps } from '../../../selectors'

const LapComparison = () => {
    const [selectedSession, setSelectedSession] = useState(-1);
    const sessions = useSelector(eventSessionNumbersTypesAndLaps);
    const laps = useSelector(currentSessionLaps);

    const buildSessionOptions = () => {
        var arr = [];
        sessions.forEach(session => {
          arr.push(<option key={session.sessionNumber} value={session.sessionNumber}>{session.sessionType}</option>)
        });
        return arr;
    }

    return (
        <>
            <CRow>
                <CCol>
                    <CSelect name="sessions" id="sessions" value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
                        <option value="-1">- Select Session -</option>
                        {buildSessionOptions()}
                    </CSelect>
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="6" >
                    <LapHistory laps={sessions.find(s=>s.sessionNumber == selectedSession)?.laps} />
                </CCol>
                <CCol sm="6">
                    <LapHistory laps={sessions.find(s=>s.sessionNumber == selectedSession)?.laps} />
                </CCol>
            </CRow>
        </>
    )
}

export default LapComparison