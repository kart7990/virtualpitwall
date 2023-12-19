import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { lapsRemainingSelector, currentDriversSelector } from '../../selectors'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CLabel,
    CRow,
    CFormGroup,
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CForm,
    CBadge,
    CTooltip,
    CSelect,
    CInputCheckbox
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';

const LapsRemainingSettings = () => {
    const dispatch = useDispatch()
    const lapsRemaining = useSelector(lapsRemainingSelector)
    const drivers = useSelector(currentDriversSelector)
    const timingPreferences = useSelector(state => state.timingPreferences)
    const numberOfPitstops = useSelector(state => state.timingPreferences.numberOfPitstops)
    const pitstopTime = useSelector(state => state.timingPreferences.pitstopTime)

    const formatTime = (timeInSeconds) => {
        if (timeInSeconds !== undefined && !Number.isNaN(timeInSeconds)) {
            //Format to M:S:MS
            var pad = function (num, size) { return ('000' + num).slice(size * -1); },
                time = parseFloat(timeInSeconds).toFixed(3),
                hours = Math.floor(time / 60 / 60),
                minutes = Math.floor(time / 60) % 60,
                seconds = Math.floor(time - minutes * 60),
                milliseconds = time.slice(-3);

            return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + pad(milliseconds, 3);
        } else {
            return 'calculating...'
        }

    }

    const buildLapNumberOptions = () => {
        var arr = [];
        for (let i = 1; i <= 100; i++) {
            arr.push(<option key={i} value={i}>{i}</option>)
        }
        return arr;
    }

    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <span className="text-muted small text-uppercase font-weight-bold">Laps Remaining Calculation Settings</span>
                            <CTooltip content="The calculation will update every time the selected driver completes a lap. Typically the laps remaining should be based on the leader.
                                 However, it can't always be based on the leader because once pit cycles start, the true leader is unknown. This is where the race engineer comes in. 
                                 Select the driver that should be regarded as the leader, all variables considered. The calculations will be paused if the driver was in pitlane at any point during their lap. 
                                 Typically, this means two laps won't get a new calculation.">
                                <CBadge className="ml-1" color="info">i</CBadge>
                            </CTooltip>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol sm="12">
                                    <div className="mb-2">
                                        <div>
                                            <span className="text-muted small text-uppercase">lap exclusions</span>
                                            {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip> */}
                                        </div>
                                        <CForm inline>
                                            <CFormGroup variant="custom-checkbox" inline>
                                                <CInputCheckbox custom id="inline-checkbox1" checked disabled name="inline-checkbox1" value="option1" />
                                                <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Pit In/Out Laps</CLabel>
                                            </CFormGroup>
                                            <CFormGroup variant="custom-checkbox" inline>
                                                <CInputCheckbox custom id="inline-checkbox2" disabled name="inline-checkbox2" value="option2" />
                                                <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Yellow Flag Laps</CLabel>
                                            </CFormGroup>
                                            <CFormGroup variant="custom-checkbox" inline>
                                                <CInputCheckbox custom id="inline-checkbox3" checked disabled name="inline-checkbox3" value="option3" />
                                                <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Lap One</CLabel>
                                            </CFormGroup>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol lg="12" xl="4">
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">number of pitstops</span>
                                            <CTooltip content="The number of expected pitstops. This value, along with pitstop time loss, is used to help calculate laps remaining with greater accuracy. This takes into account completed stops, so if the selected driver has completed all their pitstops this setting will have no effect.">
                                                <CBadge className="ml-1" color="info">i</CBadge>
                                            </CTooltip>
                                        </div>
                                        <CFormGroup>
                                            <CInputGroup>
                                                <CInput type="number" id="numberOfPitstops" name="numberOfPitstops" value={numberOfPitstops} onChange={e => dispatch({ type: 'set-timing-pref', numberOfPitstops: e.target.value })} />
                                                <CInputGroupAppend>
                                                    <CInputGroupText style={{ color: '#ffffff' }}>pitstop(s)</CInputGroupText>
                                                </CInputGroupAppend>
                                            </CInputGroup>
                                        </CFormGroup>
                                    </div>
                                </CCol>
                                <CCol lg="12" xl="4">
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">pitstop time loss</span>
                                            <CTooltip content="Estimated time lost to a pitstop. This value, along with number of pitstops, is used to help calculate laps remaining with greater accuracy. This takes into account completed stops, so if the selected driver has completed all their pitstops this setting will have no effect. This value should be calculated before the race. Perform a pitstop similar to what will be required during race. Add the total time lost (across two laps if pitlane crosses start/finish) from avgerage lap time. Alternatively, measure the time at race speed to cover the cone-to-cone distance, subtract that value from the cone-to-cone pitstop time, adding a small buffer for slowing to pit speed and getting up to speed on pit exit.">
                                                <CBadge className="ml-1" color="info">i</CBadge>
                                            </CTooltip>
                                        </div>
                                        <CFormGroup>
                                            <CInputGroup>
                                                <CInput type="number" id="pitstopSeconds" name="pitstopSeconds" value={pitstopTime} onChange={e => dispatch({ type: 'set-timing-pref', pitstopTime: e.target.value })} />
                                                <CInputGroupAppend>
                                                    <CInputGroupText style={{ color: '#ffffff' }}>seconds</CInputGroupText>
                                                </CInputGroupAppend>
                                            </CInputGroup>
                                        </CFormGroup>
                                    </div>
                                </CCol>
                                <CCol lg="12" xl="4">
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">base calculation on</span>
                                            {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip> */}
                                        </div>
                                        <CSelect name="drivers" id="drivers" onChange={e => dispatch({ type: 'set-timing-pref', selectedDriverCarNumber: e.target.value })}>
                                            <option value="-1">Leader (note: can be inaccurate during pit cycles)</option>
                                            {drivers?.map(d => {
                                                return <option key={d.carNumber} value={d.carNumber}>#{d.carNumber} {d.driverShortName}</option>;
                                            })}
                                        </CSelect>
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md="12" lg="8">
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">base laptime on</span>
                                            {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip> */}
                                        </div>

                                        <CForm inline>
                                            <CFormGroup className="pr-1">
                                                <CSelect className="pr-2" name="lapAggregate" id="lapAggregate" value={timingPreferences.lapAggregate} onChange={e => {
                                                    let filter = timingPreferences.lapFilter;
                                                    if (e.target.value !== 'average' && (timingPreferences.lapFilter === 'fastest' || timingPreferences.lapFilter === 'slowest')) {
                                                        filter = 'all'
                                                    }
                                                    dispatch({ type: 'set-timing-pref', lapAggregate: e.target.value, lapFilter: filter })
                                                }}>
                                                    <option value="average">Average</option>
                                                    <option value="fastest">Fastest</option>
                                                    <option value="slowest">Slowest</option>
                                                </CSelect>

                                                <CLabel htmlFor="lapFilter" className="pl-2 pr-2">of</CLabel>

                                                <CSelect className="pr-2" name="lapFilter" id="lapFilter" value={timingPreferences.lapFilter} onChange={e => dispatch({ type: 'set-timing-pref', lapFilter: e.target.value })}>
                                                    <option value="all">All</option>
                                                    <option value="last">Last</option>
                                                    <option value="first">First</option>
                                                    {timingPreferences.lapAggregate === 'average' &&
                                                        <option value="fastest">Fastest</option>
                                                    }
                                                    {timingPreferences.lapAggregate === 'average' &&
                                                        <option value="slowest">Slowest</option>
                                                    }
                                                </CSelect>
                                                {timingPreferences.lapFilter !== 'all' &&
                                                    <>
                                                        <span className="pl-2"></span>
                                                        <CSelect name="numberOfLaps" id="numberOfLaps" value={timingPreferences.numberOfLaps} onChange={e => dispatch({ type: 'set-timing-pref', numberOfLaps: parseInt(e.target.value) })}>
                                                            {buildLapNumberOptions()}
                                                        </CSelect>
                                                    </>
                                                }
                                                <CLabel htmlFor="numberOfLaps" className="pl-2">Laps</CLabel>
                                            </CFormGroup>
                                        </CForm>
                                    </div>
                                </CCol>
                                <CCol md="12" lg="4">
                                    <DataDisplay title="laptime used for calculation" content={formatTime(lapsRemaining.lapTimeUsedForCalculation)} />
                                </CCol>
                                {/* <CCol md="12" lg="12">
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">formula (last lap calculated)</span>
                                            {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip>
                                        </div>

                                        <CInput id="calculatedLaptime" value="timeRemaining - (pitstops * pitstopTime) / avg. of David Holland fastest 3 non exclusion laps = 129.232" />
                                    </div>
                                </CCol> */}
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol >
            </CRow >
        </>
    )
}

export default LapsRemainingSettings
