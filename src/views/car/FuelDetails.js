import React from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CLabel,
    CFormGroup,
    CInputCheckbox,
    CDataTable
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';
import { formatVolume } from '../../formatters/UnitConversion'
import { currentSessionTelemetryLaps, currentSessionLaps, currentSessionIsSpectatorSelector } from '../../selectors'
import { convertMsToDisplay } from '../../formatters/UnitConversion'

const FuelDetails = () => {
    const carTelemetry = useSelector(state => state.pitboxSession.eventDetails.telemetry?.carTelemetry)
    const useImperialUnits = useSelector(state => state.pitboxPreferences.useImperialUnits)
    const lapTelemetry = useSelector(currentSessionTelemetryLaps)
    const isSpectator = useSelector(currentSessionIsSpectatorSelector)
    const driverCarNumber = useSelector(state => state.pitboxSession.eventDetails?.standings?.find(standing => standing.isCurrentDriver))?.carNumber
    const driverLapHistory = useSelector(currentSessionLaps)?.filter(l => l.carNumber === driverCarNumber)
    const lastLapConsumed = lapTelemetry?.length > 0 ? lapTelemetry[lapTelemetry.length - 1].fuelConsumed : -1
    const validConsumptionLaps = lapTelemetry?.filter(lap => lap.greenFlagFullLap && lap.lapNumber > 1 && !lap.inPitLane)
    const validLapsTotalConsumed = validConsumptionLaps?.length > 0 ? validConsumptionLaps.reduce((totalConsumed, lap) => totalConsumed + lap.fuelConsumed, 0) : -1
    const averageConsumed = validConsumptionLaps ? validLapsTotalConsumed / validConsumptionLaps.length : -1
    const maxConsumption = validConsumptionLaps ? Math.max.apply(Math, validConsumptionLaps.map(lap => lap.fuelConsumed)) : -1
    const minConsumption = validConsumptionLaps ? Math.min.apply(Math, validConsumptionLaps.map(lap => lap.fuelConsumed)) : -1

    const formatFuel = (num) => {
        return ((num === -1 || isNaN(num) || num === Infinity || num === -Infinity) ? "-" : formatVolume(num, useImperialUnits))
    }

    const fields = ['lapNumber', 'lapTime', 'fuelConsumed']

    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>

                            <span className="text-muted small text-uppercase font-weight-bold">Fuel Analysis</span>
                            <CRow className="float-right">
                                <CCol md="12">
                                    <span className="mr-2 text-muted small text-uppercase font-weight-bold">Exclude From Analysis Aggregates: </span>
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
                                    <CCol md="3">
                                        <DataDisplay title="fuel remaining" content={formatFuel(carTelemetry?.fuelQuantity)} />
                                        <DataDisplay title="current lap consumed" content={formatFuel(carTelemetry?.fuelConsumedLap)} />
                                        <DataDisplay title="last lap consumed" content={formatFuel(lastLapConsumed)} />
                                    </CCol>
                                    <CCol md="3">
                                        <DataDisplay title="lap avg consumed" content={formatFuel(averageConsumed)} />
                                        <DataDisplay title="lap max consumed" content={formatFuel(maxConsumption)} />
                                        <DataDisplay title="lap min consumed" content={formatFuel(minConsumption)} />
                                    </CCol>

                                    <CCol md="6">
                                        <CDataTable
                                            items={lapTelemetry?.sort((a, b) => parseFloat(a.lapNumber) - parseFloat(b.lapNumber))}
                                            striped
                                            fields={fields}
                                            hover
                                            itemsPerPage={5}
                                            pagination
                                            size="sm"
                                            scopedSlots={{
                                                'lapTime':
                                                    (item) => (
                                                        <td>
                                                            {convertMsToDisplay(driverLapHistory.find(l => l.lapNumber === item.lapNumber)?.lapTime)}
                                                        </td>
                                                    ),
                                                'fuelConsumed':
                                                    (item) => (
                                                        <td>
                                                            {formatFuel(item.fuelConsumed)}
                                                        </td>
                                                    )
                                            }}
                                        />
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
            </CRow >
        </>
    )
}

export default FuelDetails
