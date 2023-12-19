import React from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CWidgetSimple,
    CLabel,
    CFormGroup,
    CInputCheckbox,
    CDataTable
} from '@coreui/react'
import { formatVolume } from '../../formatters/UnitConversion'

const Fuel = () => {
    const carTelemetry = useSelector(state => state.realTimeTelemetry.carTelemetry)
    const timingTelemetry = useSelector(state => state.realTimeTelemetry.timingTelemetry)
    const lapTelemetry = useSelector(state => state.playerLapTelemetry)
    const useImperialUnits = useSelector(state => state.useImperialUnits)

    const lastLapConsumed = lapTelemetry.length > 0 ? lapTelemetry[lapTelemetry.length - 1] : -1

    const validConsumptionLaps = lapTelemetry?.filter(lap => lap.greenFlagFullLap && lap.lapNumber > 1 && !lap.inPitLane)
    const validLapsTotalConsumed = validConsumptionLaps.length > 0 ? validConsumptionLaps.reduce((totalConsumed, lap) => +totalConsumed + +lap.fuelConsumed, 0) : -1
    const averageConsumed = validLapsTotalConsumed / validConsumptionLaps.length;
    const maxConsumption = Math.max.apply(Math, validConsumptionLaps.map(lap => lap.fuelConsumed))
    const minConsumption = Math.min.apply(Math, validConsumptionLaps.map(lap => lap.fuelConsumed))
    let lapsRemaining = (timingTelemetry.driverLapsRemaining + 1) - timingTelemetry.lapDistancePercentage
    const fuelRequiredToFinish = (lapsRemaining * averageConsumed) - carTelemetry.fuelQuantity

    const formatFuel = (num) => {
        return ((num === -1 || isNaN(num) || num == Infinity || num == -Infinity) ? "-" : formatVolume(num, useImperialUnits))
    }

    const fields = ['lapNumber', 'lapTime', 'fuelConsumed']

    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            Fuel Analysis
                        </CCardHeader>
                        <CCardBody>
                            <CFormGroup row>
                                <CCol md="12">
                                    <CLabel className="mr-2">Exclude From Average: </CLabel>
                                    <CFormGroup variant="custom-checkbox" inline>
                                        <CInputCheckbox custom id="inline-checkbox1" checked disabled name="inline-checkbox1" value="option1" />
                                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1">Pit In/Out Laps</CLabel>
                                    </CFormGroup>
                                    <CFormGroup variant="custom-checkbox" inline>
                                        <CInputCheckbox custom id="inline-checkbox2" checked disabled name="inline-checkbox2" value="option2" />
                                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox2">Non Green Flag Laps</CLabel>
                                    </CFormGroup>
                                    <CFormGroup variant="custom-checkbox" inline>
                                        <CInputCheckbox custom id="inline-checkbox3" checked disabled name="inline-checkbox3" value="option3" />
                                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox3">Lap One</CLabel>
                                    </CFormGroup>
                                </CCol>
                            </CFormGroup>
                            <CRow>
                                <CCol sm="12" md="6" lg="8">
                                    <CRow>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="laps of fuel remaining" text={(carTelemetry.fuelQuantity / averageConsumed).toFixed(2)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="4" lg="2">
                                            <CWidgetSimple header="fuel required to finish (laps based)" text={formatFuel(fuelRequiredToFinish)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="lap avg consumed" text={formatFuel(averageConsumed)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="lap max consumed" text={formatFuel(maxConsumption)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="lap min consumed" text={formatFuel(minConsumption)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="last lap consumed" text={formatFuel(lastLapConsumed)}>
                                            </CWidgetSimple>
                                        </CCol>
                                        <CCol sm="6" md="4" lg="3">
                                            <CWidgetSimple header="current lap consumed" text={formatFuel(carTelemetry.fuelConsumedLap)}>
                                            </CWidgetSimple>
                                        </CCol>
                                    </CRow>

                                </CCol>
                                <CCol sm="12" md="6" lg="4">
                                    <CCard>
                                        <CCardHeader>Consumption History</CCardHeader>
                                        <CCardBody>
                                            <CDataTable
                                                items={lapTelemetry.sort((a, b) => parseFloat(a.lapNumber) - parseFloat(b.lapNumber))}
                                                striped
                                                fields={fields}
                                                hover
                                                size="sm"
                                                scopedSlots={{
                                                    'lapTime':
                                                        (item) => (
                                                            <td>
                                                                {item.lapTime?.display}
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
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default Fuel
