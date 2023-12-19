import React from 'react'
import { useSelector } from 'react-redux'
import {
  CAlert,
  CCol,
  CRow
} from '@coreui/react'

import Performance from '../car/Performance.js'
import Timing from '../timing/Timing.js'
import SessionConditions from '../event/SessionConditions.js'
import TrackMap from '../track/TrackMap.js'
import Standings from '../timing/Standings.js'
import FuelDetails from '../car/FuelDetails.js'
import Telemetry from '../car/Telemetry.js'
import PitStop from '../car/PitStop.js'
import SessionEvents from '../event/SessionEvents.js'
import LapsRemainingSettings from '../timing/LapsRemainingSettings.js'

const Dashboard = () => {
  const isSessionActive = useSelector(state => state.session?.isActive)
  const isTimed = useSelector(state => state.session?.isTimed)
  const isRace = useSelector(state => state.session?.isRace)
  const player = useSelector(state => state.player)
  return (
    <>
      {isSessionActive &&
        <>
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
          {isRace &&
            <CRow>
              {isTimed &&
                <CCol sm="12" md="6">
                  <LapsRemainingSettings />
                </CCol>
              }

              {player &&
                <CCol sm="12" md={isTimed ? "6" : "12"}>
                  <PitStop />
                </CCol>
              }
            </CRow>
          }
          {player ?
            <>
              <CRow>
                <CCol sm="12">
                  <FuelDetails />
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
              <CRow>
                <CCol sm="12" md="6">
                  <Performance />
                </CCol>
                <CCol sm="12" md="6">
                  <Telemetry />
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="12">
                  <SessionEvents />
                </CCol>
              </CRow>
            </>
            :
            <>
              <CRow>
                <CCol sm="12" md="6">
                  <SessionConditions />
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CAlert color="warning">Spectator mode, telemetry data is unavailable.</CAlert>
                </CCol>
              </CRow>
            </>
          }

        </>
      }
      {
        !isSessionActive &&
        <p>Session transitioning, completed, waiting for iRacing data, or lost connection.</p>
      }
    </>
  )
}

export default Dashboard
