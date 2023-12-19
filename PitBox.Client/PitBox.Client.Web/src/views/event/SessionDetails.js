import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { lapsRemainingSelector } from '../../selectors'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CLabel,
    CRow,
    CWidgetSimple,
    CFormGroup,
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CForm,
    CBadge,
    CTooltip
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';

const SessionDetails = () => {
    const dispatch = useDispatch()
    const session = useSelector(state => state.session)
    const lapsRemaining = useSelector(lapsRemainingSelector)
    const lapsRemainingVariables = useSelector(state => state.lapsRemainingVariables)
    const pitstopTime = useSelector(state => state.pitstopTime)
    const sessionTiming = useSelector(state => state.timing)
    const driverStandings = useSelector(state => state.standings.find(standing => standing.isCurrentDriver))

    const formatTime = (timeInSeconds) => {
        //Format to M:S:MS
        var pad = function (num, size) { return ('000' + num).slice(size * -1); },
            time = parseFloat(timeInSeconds).toFixed(3),
            hours = Math.floor(time / 60 / 60),
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time - minutes * 60);

        let formattedHours = hours > 0 ? pad(hours, 2) + ':' : ''
        return formattedHours + pad(minutes, 2) + ':' + pad(seconds, 2);
    }

    const formatPositiveNumberOrUsePlaceholder = (num, placeholder) => {
        return (num == null || Math.sign(num) === -1 || Number.isNaN(num) ? placeholder : num.toString())
    }

    return (
        <>
            <CRow>
                {session.isTimed && session.isRace &&
                    <>
                        <CCol sm="4">
                            <div>
                                <div>
                                    <span className="text-muted small text-uppercase">number of pitstops</span>
                                    <CTooltip content="The number of expected pitstops. This value, along with time spent in pits, is only used to help calculate laps remaining with greater accuracy.">
                                        <CBadge className="ml-1" color="info">i</CBadge>
                                    </CTooltip>
                                </div>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CInput type="number" id="numberOfPitstops" name="numberOfPitstops" onChange={e => dispatch({ type: 'set', lapsRemainingVariables: { ...lapsRemainingVariables, numberOfPitstops: e.target.value } })} />
                                        <CInputGroupAppend>
                                            <CInputGroupText style={{ color: '#ffffff' }}>pitstop(s)</CInputGroupText>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CFormGroup>
                            </div>
                        </CCol>
                        <CCol sm="4">
                            <div>
                                <div>
                                    <span className="text-muted small text-uppercase">pitstop time loss</span>
                                    <CTooltip content="Estimated time lost to a pitstop. This value should be calculated before the race. Perform a pitstop similar to what will be required during race. Add the total time lost (across two laps if pitlane crosses start/finish) from avgerage lap time. This value, along with number of pitstops, is only used to help calculate laps remaining with greater accuracy.">
                                        <CBadge className="ml-1" color="info">i</CBadge>
                                    </CTooltip>
                                </div>
                                <CFormGroup>
                                    <CInputGroup>
                                        <CInput type="number" id="pitstopSeconds" name="pitstopSeconds" value={pitstopTime} onChange={e => dispatch({ type: 'set', lapsRemainingVariables: { ...lapsRemainingVariables, pitstopTime: e.target.value } })} />
                                        <CInputGroupAppend>
                                            <CInputGroupText style={{ color: '#ffffff' }}>seconds</CInputGroupText>
                                        </CInputGroupAppend>
                                    </CInputGroup>
                                </CFormGroup>
                            </div>
                        </CCol>
                    </>
                }
                {/* <CCol sm="2"  >
                    {session.isFixedLaps &&
                        <DataDisplay title="Driver Lap" content={formatPositiveNumberOrDash(driverStandings.lap) + "/" + session.raceLaps} />
                    }

                    {session.isTimed &&
                        session.isRace ?
                        <DataDisplay title="Driver Lap" content={formatPositiveNumberOrDash(driverStandings?.lap) + "/~" + sessionTiming.estimatedWholeRaceLaps + " (" + sessionTiming.estimatedRaceLaps.toFixed(3) + ")"} />
                        :
                        <DataDisplay title="Driver Lap" content={formatPositiveNumberOrDash(driverStandings?.lap)} />
                    }
                </CCol> */}
                <CCol sm="2"  >
                    <DataDisplay title="Driver Current Lap #" content={formatPositiveNumberOrUsePlaceholder(driverStandings?.lap, '-')} />
                </CCol>
                <CCol sm="2"  >
                    <DataDisplay title="# Laps Remaining" content={formatPositiveNumberOrUsePlaceholder(lapsRemaining.wholeLapsRemaining, 'calculating...')} />
                </CCol>
            </CRow>
            {/* <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader><span className="text-muted small text-uppercase font-weight-bold">Session Details</span>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol>
                                    <DataDisplay title="Type" content={session.sessionType} />
                                    <DataDisplay title="Status" content={session.sessionState} />
                                    <DataDisplay title="Session Time Remaining" content={formatTime(timingTelemetry.sessionTimeRemaining.toFixed(3))} />
                                    {session.isRace &&
                                        <DataDisplay title="Current Lap / Race Laps" content={formatPositiveNumberOrDash(driverStandings?.lap) + "/~" + timingTelemetry.estimatedWholeRaceLaps + " (" + timingTelemetry.estimatedRaceLaps.toFixed(3) + ")"} />
                                    }
                                    {!session.isRace &&
                                        <DataDisplay title="Current Lap" content={formatPositiveNumberOrDash(driverStandings?.lap)} />
                                    }
                                    <DataDisplay title={session.isRace ? "Laps Remaining" : "Laps Possible with Remaining Time"} content={formatPositiveNumberOrDash(timingTelemetry.driverLapsRemaining)} />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow> */}
        </>
    )
}

export default SessionDetails