import React from 'react'
import { CCol, CRow } from '@coreui/react'
import Standings from '../../views/timing/Standings'
import TrackMap from '../../views/track/TrackMap.js'
import Telemetry from '../../views/car/Telemetry'
import Timing from '../../views/timing/Timing'
import SessionConditions from '../../views/event/SessionConditions.js'
import LapsRemainingSettings from '../../views/timing/LapsRemainingSettings'
import FuelDetails from '../../views/car/FuelDetails'
import PitStop from '../../views/car/PitStop'

const Dashboard = () => {
  return (
    <>
      <p>Dashboard</p>
      <CRow>
        <CCol sm="12" md="6" >
          <CRow>
            <CCol sm="12"  >
              <TrackMap />
            </CCol>
          </CRow>
        </CCol>
        <CCol sm="12" md="6">
          <Standings />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12" md="6">
          <LapsRemainingSettings />
        </CCol>
        <CCol sm="12" md="6">
          <PitStop />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12" md="6">
          <FuelDetails />
        </CCol>
        <CCol sm="12" md="6">
          <Telemetry />
        </CCol>
      </CRow>
      <CRow>
        <CCol sm="12" lg="6">
          <Timing />
        </CCol>
        <CCol sm="12" lg="6">
          <SessionConditions />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard