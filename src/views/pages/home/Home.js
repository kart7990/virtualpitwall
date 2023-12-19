import React from 'react'
import { Link } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CAlert,
    CContainer,
    CForm,
    CRow,
    CCardHeader,
    CListGroup,
    CListGroupItem,
    CBadge
} from '@coreui/react'

const Home = () => {
    return (
        <>
            <CRow >
                <CCol md="6">
                    <CCardGroup>
                        <CCard className="p-4">
                            <CCardBody>
                                <CForm>
                                    <h1>Step 1 - Install Virtual Pitbox</h1>
                                    <p>Virtual Pitbox requires an application to be installed which sends iRacing session and telemetry data to the Virtual Pitbox dashboard. If you are only viewing a session, the install is not necessary. Simply use the link provided by the driver of the session you wish to view.</p>

                                    <a href="/app/setup.exe" download target="_self">
                                        <CButton color="primary" className="mt-3">Download</CButton>
                                    </a>

                                    
                                    <CAlert className="mt-4" color="warning">When installing the app, a security warning might be displayed (depending on security settings) because the app isn't signed with a valid code signing certificate. That should be resolved soon, select "Run Anyway" for now.</CAlert>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
                <CCol md="6">
                    <CCardGroup>
                        <CCard className="p-4">
                            <CCardBody>
                                <CForm>
                                    <h1>Step 2 - Start Session and Share Link</h1>
                                    <p>Start a Virtual Pitbox session from the app, share the link, and load into an iRacing session. That's it! Realtime data will be sent to your dashboard.</p>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>
            <CRow>
                <CCol md="12" className="pt-4">
                    <CCardGroup>
                        <CCard >
                            <CCardBody>
                                <CForm>
                                    <h1>Dashboard Modes</h1>
                                    <CRow>
                                        <CCol md="12" className="pt-4">
                                            <CAlert color="warning"> Data derived from telemetry requires the driver to host the pitbox session.</CAlert>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol md="6">
                                            <CCardGroup>
                                                <CCard>
                                                    <CCardHeader>
                                                        <strong>Full Telemetry Mode:</strong> Enabled when the host is driving.
                                                    </CCardHeader>
                                                    <CCardBody>
                                                        <CListGroup>
                                                            <CListGroupItem color="success">Track Map</CListGroupItem>
                                                            <CListGroupItem color="success">Standings</CListGroupItem>
                                                            <CListGroupItem color="success">Lap History</CListGroupItem>
                                                            <CListGroupItem color="success">Session Timing</CListGroupItem>
                                                            <CListGroupItem color="success">Weather Conditions</CListGroupItem>
                                                            <CListGroupItem color="success">Track Conditions</CListGroupItem>
                                                            <CListGroupItem color="success">Laps Remaining Calculations</CListGroupItem>
                                                            <CListGroupItem color="success">Car Telemetry</CListGroupItem>
                                                            <CListGroupItem color="success">Pitstop Fuel Calculations</CListGroupItem>
                                                            <CListGroupItem color="success">Fuel Analysis</CListGroupItem>
                                                            <CListGroupItem color="success">Realtime Lap Timing/Deltas</CListGroupItem>
                                                        </CListGroup>
                                                    </CCardBody>
                                                </CCard>
                                            </CCardGroup>
                                        </CCol>
                                        <CCol md="6">
                                            <CCardGroup>
                                                <CCard>
                                                    <CCardHeader>
                                                        <strong>Spectator Mode:</strong> Enabled when the host is not driving.
                                                    </CCardHeader>
                                                    <CCardBody>
                                                        <CListGroup>
                                                            <CListGroupItem color="success">Track Map</CListGroupItem>
                                                            <CListGroupItem color="success">Standings</CListGroupItem>
                                                            <CListGroupItem color="success">Lap History</CListGroupItem>
                                                            <CListGroupItem color="success">Session Timing</CListGroupItem>
                                                            <CListGroupItem color="success">Weather Conditions</CListGroupItem>
                                                            <CListGroupItem color="success">Track Conditions</CListGroupItem>
                                                            <CListGroupItem color="success">Laps Remaining Calculations</CListGroupItem>
                                                            <CListGroupItem color="danger">Car Telemetry</CListGroupItem>
                                                            <CListGroupItem color="danger">Pitstop Fuel Calculations</CListGroupItem>
                                                            <CListGroupItem color="danger">Fuel Analysis</CListGroupItem>
                                                            <CListGroupItem color="danger">Realtime Lap Timing/Deltas</CListGroupItem>
                                                        </CListGroup>
                                                    </CCardBody>
                                                </CCard>
                                            </CCardGroup>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>
        </>
    )
}

export default Home