import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CFormGroup,
    CLabel,
    CForm,
    CSelect,
    CInputCheckbox,
    CInput
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';
import { lapsRemainingSelector, currentSessionTelemetryLaps, currentSessionIsSpectatorSelector } from '../../selectors'
import { formatVolume, getVolumeUnit } from '../../formatters/UnitConversion'

const PitStop = () => {
    const lapsRemaining = useSelector(lapsRemainingSelector)
    const [fuelCalcAggregate, setFuelCalcAggregate] = useState('average');
    const [fuelCalcLapFilter, setFuelCalcLapFilter] = useState('all');
    const [fuelCalcNumberOfLaps, setFuelCalcNumberOfLaps] = useState(1);
    const [fuelCapacityMaxPercent, setFuelCapacityMaxPercent] = useState(100);
    const [fuelRequiredToFinishLive, setFuelRequiredToFinishLive] = useState(-1);
    const [customFuelConsumptionPerLap, setCustomFuelConsumptionPerLap] = useState(0);
    const [fuelRequiredToFinishAtTheLine, setFuelRequiredToFinishAtTheLine] = useState(-1);
    const [fuelConsumptionPerLap, setFuelConsumptionPerLap] = useState(-1);
    const [tankCapacity, setTankCapacity] = useState(-1);
    const [driverLapsRemaining, setDriverLapsRemaining] = useState(-1);


    //TODO: use memoized selector to derive all fuel details calculations once
    const carTelemetry = useSelector(state => state.pitboxSession.eventDetails.telemetry?.carTelemetry)
    const timingTelemetry = useSelector(state => state.pitboxSession.eventDetails.telemetry?.timingTelemetry)
    const isSpectator = useSelector(currentSessionIsSpectatorSelector)
    const lapTelemetry = useSelector(currentSessionTelemetryLaps)
    const useImperialUnits = useSelector(state => state.pitboxPreferences.useImperialUnits)

    const isPositiveNumber = (num) => {
        return !(num == null || Math.sign(num) === -1 || Number.isNaN(num) || num < 0 || num == Infinity)
    }

    const renderFuelWindow = (driverLapsRemaining, fuelConsumptionPerLap, tankCapacity) => {
        let content = 'calculating...'
        if (isPositiveNumber(fuelConsumptionPerLap)) {
            content = 'open'
            if (driverLapsRemaining * fuelConsumptionPerLap > tankCapacity) {
                let lapsTillOpen = (driverLapsRemaining - (tankCapacity / fuelConsumptionPerLap))
                content = 'closed (open in ' + lapsTillOpen.toFixed(2) + ' laps)'
            }
        }

        return <DataDisplay title="final fuel pitstop window" content={content} />
    }

    useEffect(() => {
        if (carTelemetry) {
            let capacity = carTelemetry.fuelQuantity / carTelemetry.fuelPercent
            let restrictedCapacity = capacity * (fuelCapacityMaxPercent / 100)
            setTankCapacity(restrictedCapacity)
        }
    }, [carTelemetry, fuelCapacityMaxPercent])

    useEffect(() => {
        let consumptionPerLap = null

        if (fuelCalcAggregate === 'custom') {
            if (isPositiveNumber(customFuelConsumptionPerLap)) {
                consumptionPerLap = parseFloat(customFuelConsumptionPerLap)
                setFuelConsumptionPerLap(consumptionPerLap)
            }
        } else if (carTelemetry && timingTelemetry && lapTelemetry?.length > 0) {
            if (fuelCalcAggregate !== 'custom') {
                consumptionPerLap = null
                let filteredConsumptionLaps = lapTelemetry.filter(lap => lap.greenFlagFullLap && lap.lapNumber > 1 && !lap.inPitLane)
                if (fuelCalcLapFilter === 'last') {
                    filteredConsumptionLaps = filteredConsumptionLaps.sort((a, b) => parseFloat(a.lapNumber) - parseFloat(b.lapNumber))
                } else if (fuelCalcLapFilter === 'first') {
                    filteredConsumptionLaps = filteredConsumptionLaps.sort((a, b) => parseFloat(b.lapNumber) - parseFloat(a.lapNumber))
                }

                if (fuelCalcLapFilter !== 'all') {
                    filteredConsumptionLaps = filteredConsumptionLaps.slice(-fuelCalcNumberOfLaps)
                }

                if (fuelCalcAggregate === 'max') {
                    consumptionPerLap = Math.max.apply(Math, filteredConsumptionLaps.map(lap => lap.fuelConsumed))
                } else if (fuelCalcAggregate === 'min') {
                    consumptionPerLap = Math.min.apply(Math, filteredConsumptionLaps.map(lap => lap.fuelConsumed))
                } else {
                    //assume average
                    let filteredLapsTotalConsumed = filteredConsumptionLaps.length > 0 ? filteredConsumptionLaps.reduce((totalConsumed, lap) => totalConsumed + lap.fuelConsumed, 0) : -1
                    consumptionPerLap = filteredLapsTotalConsumed / filteredConsumptionLaps.length;
                }

                setFuelConsumptionPerLap(consumptionPerLap)
            }

            let lastLapTelemetry = lapTelemetry[lapTelemetry.length - 1]

            let driverLapsRemaining = lapsRemaining.wholeRaceLaps - ((timingTelemetry.driverCurrentLap - 1) + timingTelemetry.lapDistancePercentage)
            //TODO: use this for lap down scenarios let driverLapsRemaining = (lapsRemaining.wholeRaceLaps - lapsDown) - ((timingTelemetry.driverCurrentLap - 1) + timingTelemetry.lapDistancePercentage)

            //Ignore below once above is implemented
            // if (Math.floor(driverLapsRemaining) - 1 > lapsRemaining.wholeLapsRemaining) {
            //     console.log('LAPDOWN!!!!!!!!!!')
            //     lapsdownRough = (Math.floor(driverLapsRemaining) - 1) - lapsRemaining.wholeLapsRemaining
            //     //lap down, get it close
            //     //TODO: calculate this better
            //     driverLapsRemaining = (lapsRemaining.wholeLapsRemaining + 1) - timingTelemetry.lapDistancePercentage;
            // }

            setDriverLapsRemaining(driverLapsRemaining)

            //live
            let requiredToFinishLive = (driverLapsRemaining * consumptionPerLap) - carTelemetry.fuelQuantity
            setFuelRequiredToFinishLive(requiredToFinishLive)

            //at the line
            let requiredToFinishAtTheLine = ((lapsRemaining.wholeRaceLaps - lastLapTelemetry.lapNumber) * consumptionPerLap) - lastLapTelemetry.fuelLapEnd
            setFuelRequiredToFinishAtTheLine(requiredToFinishAtTheLine)
        } else {
            setFuelConsumptionPerLap(null)
        }
    }, [lapsRemaining, fuelCalcAggregate, fuelCalcLapFilter, fuelCalcNumberOfLaps, lapTelemetry, timingTelemetry, carTelemetry, customFuelConsumptionPerLap]);

    const formatFuel = (num) => {
        return ((num == -1 || isNaN(num) || num == Infinity || num == -Infinity) ? "-" : formatVolume(num, useImperialUnits))
    }

    const buildLapNumberOptions = () => {
        var arr = [];
        for (let i = 1; i <= 100; i++) {
            arr.push(<option key={i} value={i}>{i}</option>)
        }
        return arr;
    }

    const buildPercentOptions = () => {
        var arr = [];
        for (let i = 1; i <= 100; i++) {
            arr.push(<option key={i} value={i}>{i}%</option>)
        }
        return arr;
    }

    return (
        <>

            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <span className="text-muted small text-uppercase font-weight-bold">Pit Stop</span>
                            <CRow className="float-right">
                                <CCol md="12">
                                    <span className="mr-2 text-muted small text-uppercase font-weight-bold">Lap Exclusions: </span>
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
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            {!isSpectator || carTelemetry ?
                                <CRow>
                                    <CCol md="6">
                                        <div className="mb-1">
                                            <div className="mb-1">
                                                <span className="text-muted small text-uppercase">lap consumption value based on</span>
                                                {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip> */}
                                            </div>
                                            <CForm inline>
                                                <CFormGroup className="pr-1">
                                                    <CSelect className="pr-2" name="fuelCalcAggregate" id="fuelCalcAggregate" onChange={e => setFuelCalcAggregate(e.target.value)}>
                                                        <option value="average">Average</option>
                                                        <option value="min">Min</option>
                                                        <option value="max">Max</option>
                                                        <option value="custom">Custom</option>
                                                    </CSelect>
                                                    {fuelCalcAggregate !== 'custom' ?
                                                        <>
                                                            <CLabel htmlFor="fuelCalcLapFilter" className="pl-2 pr-2">of</CLabel>
                                                            <CSelect className="pr-2" name="fuelCalcLapFilter" id="fuelCalcLapFilter" onChange={e => setFuelCalcLapFilter(e.target.value)}>
                                                                <option value="all">All</option>
                                                                <option value="last">Last</option>
                                                                <option value="first">First</option>
                                                            </CSelect>
                                                            {fuelCalcLapFilter !== 'all' &&
                                                                <>
                                                                    <span className="pl-2"></span>
                                                                    <CSelect name="fuelCalcNumberOfLaps" id="fuelCalcNumberOfLaps" value={fuelCalcNumberOfLaps} onChange={e => setFuelCalcNumberOfLaps(e.target.value)}>
                                                                        {buildLapNumberOptions()}
                                                                    </CSelect>
                                                                </>
                                                            }
                                                            <CLabel htmlFor="fuelCalcNumberOfLaps" className="pl-2">Laps</CLabel>
                                                        </>
                                                        :
                                                        <>
                                                            <CInput className="ml-2" style={{ maxWidth: 200, width: 75 }} id="customFuelConsumption" aria-describedby="customFuelConsumption" value={customFuelConsumptionPerLap} onChange={e => setCustomFuelConsumptionPerLap(e.target.value)} />
                                                            <CLabel className="ml-2"> {getVolumeUnit(useImperialUnits)} </CLabel>
                                                        </>
                                                    }
                                                </CFormGroup>
                                            </CForm>
                                        </div>
                                        <DataDisplay title="resulting lap consumption" content={isPositiveNumber(fuelConsumptionPerLap) ? formatFuel(fuelConsumptionPerLap) : 'calculating...'} />
                                        <div className="mb-1">
                                            <div className="mb-1">
                                                <span className="text-muted small text-uppercase">max fuel capacity</span>
                                                {/* <CTooltip content="">
                                                    <CBadge className="ml-1" color="info">i</CBadge>
                                                </CTooltip> */}
                                            </div>
                                            <CSelect name="fuelCapacityRestriction" id="fuelCapacityRestriction" value={fuelCapacityMaxPercent} onChange={e => setFuelCapacityMaxPercent(e.target.value)}>
                                                {buildPercentOptions()}
                                            </CSelect>
                                        </div>
                                    </CCol>
                                    <CCol md="6">
                                        {renderFuelWindow(driverLapsRemaining, fuelConsumptionPerLap, tankCapacity)}
                                        <DataDisplay title="Laps of fuel remaining" content={isPositiveNumber(fuelConsumptionPerLap) ? (carTelemetry.fuelQuantity / fuelConsumptionPerLap).toFixed(2) : 'calculating...'} />
                                        <DataDisplay title="fuel required to finish / live" content={isPositiveNumber(fuelConsumptionPerLap) ? formatFuel(fuelRequiredToFinishAtTheLine) + ' / ' + formatFuel(fuelRequiredToFinishLive) + '' : 'calculating...'} />

                                        <DataDisplay title="remaining fuel pitstops to finish / (live)" content={isPositiveNumber(fuelConsumptionPerLap) ? Math.ceil(fuelRequiredToFinishAtTheLine / tankCapacity) + ' (' + (fuelRequiredToFinishAtTheLine / tankCapacity).toFixed(2) + ')' + ' / ' + Math.ceil(fuelRequiredToFinishLive / tankCapacity) + ' (' + (fuelRequiredToFinishLive / tankCapacity).toFixed(2) + ')' : 'calculating...'} />

                                    </CCol>
                                </CRow>
                                :
                                <CRow>
                                    <CCol>
                                        <p> Unavailable, host's car not on track. </p>
                                    </CCol>
                                </CRow>
                            }
                        </CCardBody>
                    </CCard>
                </CCol >
            </CRow>
        </>
    )
}

export default PitStop
