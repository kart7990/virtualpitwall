import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCollapse,
    CCol,
    CNavLink,
    CRow
} from '@coreui/react'
import AmChartGuageExample from '../charts/AmChartGuageExample';
import VerticalBarFill from '../charts/VerticalBarFill';
import { getSpeedUnit, convertSpeed, getVolumeUnit, convertVolume } from '../../formatters/UnitConversion'

const Performance = () => {

    const [collapse, setCollapse] = useState(false)
    const carTelemetry = useSelector(state => state.telemetry?.carTelemetry)
    const useImperialUnits = useSelector(state => state.useImperialUnits)
    const maxFuel = carTelemetry ? parseInt(((convertVolume(carTelemetry.fuelQuantity, useImperialUnits) / carTelemetry.fuelPercent) + 1).toFixed(0)) : 0

    const toggle = (e) => {
        setCollapse(!collapse)
        e.preventDefault()
    }

    return (
        <>
            {carTelemetry ?
                <CRow>
                    <CCol>
                        <CCard>
                            <CCardHeader><span className="text-muted small text-uppercase font-weight-bold">Telemetry Gauges</span>
                                <div className="card-header-actions">
                                    <CNavLink style={{ padding: 0 }} onClick={toggle}>{collapse ? <span>show</span> : <span>collapse</span>}</CNavLink>
                                </div>
                            </CCardHeader>
                            <CCollapse show={!collapse}>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs="12" md="6" >
                                            <AmChartGuageExample min={0} max={useImperialUnits ? 220 : 350} trackMax unit={getSpeedUnit(useImperialUnits)} value={convertSpeed(carTelemetry?.speed, useImperialUnits)} chartName="speedGuage" accuracy={1} />
                                        </CCol>
                                        <CCol xs="12" md="6">
                                            <AmChartGuageExample min={0} max={9000} trackMax unit="RPM" value={carTelemetry?.rpm} chartName="rpmGuage" accuracy={0} />
                                        </CCol><CCol xs="12" md="6">
                                            <AmChartGuageExample min={0} max={maxFuel} unit={getVolumeUnit(useImperialUnits)} value={convertVolume(carTelemetry?.fuelQuantity, useImperialUnits)} chartName="fuelGuage" accuracy={3} />
                                        </CCol>
                                        <CCol xs="12" md="6" className="align-self-center d-flex justify-content-center">
                                            <VerticalBarFill className="bg-info" percent={carTelemetry?.clutch}></VerticalBarFill>
                                            <VerticalBarFill className="bg-danger" percent={carTelemetry?.brake}></VerticalBarFill>
                                            <VerticalBarFill className="bg-success" percent={carTelemetry?.throttle}></VerticalBarFill>
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCollapse>
                        </CCard>
                    </CCol>
                </CRow>
                :
                <div>...</div>}
        </>
    )
}

export default Performance
