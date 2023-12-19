import React from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CLabel,
    CRow,
    CWidgetSimple
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay';
import { formatSpeed, getSpeedUnit, convertSpeed, formatTemp } from '../../formatters/UnitConversion'

import {currentSessionCondidtionsSelector, currentSessionTimingSelector, currentSessionSelector} from '../../selectors'

const SessionConditions = () => {
    const conditions = useSelector(currentSessionCondidtionsSelector)
    const sessionTiming = useSelector(currentSessionTimingSelector) 
    const useImperialUnits = useSelector(state => state.pitboxPreferences.useImperialUnits)

    const formatTime = (timeInSeconds) => {
        //Format to M:S:MS
        var pad = function (num, size) { return ('000' + num).slice(size * -1); },
            time = parseFloat(timeInSeconds).toFixed(3),
            hours = Math.floor(time / 60 / 60),
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time - minutes * 60);

        return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
    }

    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader><span className="text-muted small text-uppercase font-weight-bold">Conditions</span>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol md="6">
                                    <DataDisplay title="Sim Time" content={sessionTiming?.simTimeOfDay} />
                                    <DataDisplay title="Track Temp" content={formatTemp(conditions?.trackTemp, useImperialUnits)} />
                                    <DataDisplay title="Air Temp" content={formatTemp(conditions?.airTemp, useImperialUnits)} />
                                </CCol>
                                <CCol md="6">
                                    <DataDisplay title="Wind" content={conditions?.windDirection + " " + formatSpeed(conditions?.windSpeed, useImperialUnits)} />
                                    <DataDisplay title="Relative Humidity" content={(conditions?.relativeHumidity * 100).toFixed(0) + "%"} />
                                    <DataDisplay title="Track Usage" content={conditions?.trackUsage} />
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            </>
    )
}

export default SessionConditions