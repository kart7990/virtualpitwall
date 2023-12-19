import React from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react'
import DataDisplay from '../../formatters/DataDisplay'
import { currentSessionIsSpectatorSelector } from '../../selectors'
import { convertMsToDisplay } from '../../formatters/UnitConversion'

const Timing = () => {
  const telemetryTiming = useSelector(state => state.pitboxSession.eventDetails.telemetry?.timingTelemetry)
  const driverStandings = useSelector(state => state.pitboxSession.eventDetails?.standings?.find(standing => standing.isCurrentDriver))
  const isSpectator = useSelector(currentSessionIsSpectatorSelector)

  const formatTime = (timeInSeconds) => {
    //Format to M:S:MS
    var pad = function (num, size) { return ('000' + num).slice(size * -1); },
      time = parseFloat(timeInSeconds).toFixed(3),
      hours = Math.floor(time / 60 / 60),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time - minutes * 60),
      milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + pad(milliseconds, 3);
  }

  const isNegative = (time) => {
    return Math.sign(time) === -1 || Math.sign(time) === 0
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader><span className="text-muted small text-uppercase font-weight-bold">Lap Timing</span>
            </CCardHeader>
            <CCardBody>
              {!isSpectator || telemetryTiming ?
                <CRow>
                  <CCol md="6">
                    <DataDisplay title="current lap" content={formatTime(telemetryTiming?.currentLapTime)} />
                    <DataDisplay title="best lap" content={convertMsToDisplay(driverStandings?.bestLaptime)} />
                    <DataDisplay title="avg lap" content="-" />
                  </CCol>
                  <CCol md="6">
                    <DataDisplay title="last lap" content={convertMsToDisplay(driverStandings?.lastLaptime)} />
                    <DataDisplay title="delta session best lap" color={isNegative(telemetryTiming?.lapDeltaToSessionBestLap) ? '#2eb85c' : '#e55353'}
                      content={isNegative(telemetryTiming?.lapDeltaToSessionBestLap) ? formatTime(Math.abs(telemetryTiming?.lapDeltaToSessionBestLap)) : formatTime(telemetryTiming?.lapDeltaToSessionBestLap)} />
                    <DataDisplay title="incidents" content={telemetryTiming?.incidents} />
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

export default Timing
