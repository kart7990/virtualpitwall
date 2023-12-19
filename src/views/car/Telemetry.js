import React from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';
import { formatSpeed, formatVolume, formatTemp } from '../../formatters/UnitConversion'

const Telemetry = () => {
    const isCarTelemetryActive = useSelector(state => state.pitboxSession.eventDetails.isCarTelemetryActive)
    const carTelemetry = useSelector(state => state.pitboxSession.eventDetails.telemetry?.carTelemetry)
    const useImperialUnits = useSelector(state => state.pitboxPreferences.useImperialUnits)

    const steeringAngle = (rads) => {
        var pi = Math.PI;
        return rads * (180 / pi);
    }

    const isNegative = (time) => {
        return Math.sign(time) === -1 || Math.sign(time) === 0
    }

    const formatFuel = (num) => {
        return ((num === -1 || isNaN(num) || num == Infinity || num == -Infinity) ? "-" : formatVolume(num, useImperialUnits))
    }

    return (
        <>

            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader><span className="text-muted small text-uppercase font-weight-bold">Telemetry</span>
                        </CCardHeader>
                        <CCardBody>
                            {isCarTelemetryActive && carTelemetry ?
                                <CRow>
                                    <CCol md="4">
                                        <DataDisplay title="speed" content={formatSpeed(carTelemetry.speed, useImperialUnits)} />
                                        <DataDisplay title="rpm" content={carTelemetry.rpm} />
                                        <DataDisplay title="fuel quantity" content={formatFuel(carTelemetry.fuelQuantity)} />
                                        <DataDisplay title="fuel percent" content={carTelemetry.fuelPercent * 100 + '%'} />
                                    </CCol>
                                    <CCol md="4">
                                        <DataDisplay title="throttle" content={carTelemetry.throttle + '%'} />
                                        <DataDisplay title="brake" content={carTelemetry.brake + '%'} />
                                        <DataDisplay title="clutch" content={carTelemetry.clutch + '%'} />
                                        <DataDisplay title="steering angle" content={steeringAngle(carTelemetry.steeringAngle).toFixed(1) + '\u00b0'} />
                                    </CCol>
                                    <CCol md="4">
                                        <DataDisplay title="fuel pressure" content={carTelemetry.fuelPressure} />
                                        <DataDisplay title="oil temp" content={formatTemp(carTelemetry.oilTemp, useImperialUnits)} />
                                        <DataDisplay title="oil pressure" content={carTelemetry.oilPressure} />
                                        <DataDisplay title="water temp" content={formatTemp(carTelemetry.waterTemp, useImperialUnits)} />
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

export default Telemetry
