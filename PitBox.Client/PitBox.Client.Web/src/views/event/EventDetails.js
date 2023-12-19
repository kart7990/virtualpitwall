import React from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetSimple
} from '@coreui/react'
import ChartLineSimple from '../charts/ChartLineSimple';
import ChartBarSimple from '../charts/ChartBarSimple';

const EventDetails = () => {
  const raceDetails = useSelector(state => state.telemetry.RaceDetails)
  const driver = useSelector(state => state.telemetry.Driver)

  const formatTime = (timeInSeconds) => {
    //Format to M:S:MS
    var pad = function (num, size) { return ('000' + num).slice(size * -1); },
      time = parseFloat(timeInSeconds).toFixed(3),
      hours = Math.floor(time / 60 / 60),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time - minutes * 60),
      milliseconds = time.slice(-3);

    let formattedHours = hours > 0 ? pad(hours, 2) + ':' : ''
    return formattedHours + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + pad(milliseconds, 3);
  }

  const formatPositiveNumberOrDash = (num) => {
    return (Math.sign(num) === -1 ? "-" : num)
  }


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Race Details</CCardHeader>
            <CCardBody>
              <CRow>
                {/* <CCol sm="4" lg="2">
                  <CWidgetSimple header="Session Type" text={raceDetails.SessionName}>
                  </CWidgetSimple>
                </CCol>
                <CCol sm="4" lg="2">
                  <CWidgetSimple header="Position" text={formatPositiveNumberOrDash(driver.Position)}>
                  </CWidgetSimple>
                </CCol>
                <CCol sm="4" lg="2">
                  <CWidgetSimple header="Time Remaining" text={formatTime(raceDetails.RaceTimeRemaining)}>
                  </CWidgetSimple>
                </CCol>
                <CCol sm="4" lg="2">
                  <CWidgetSimple header="Current Lap / Race Laps" text={formatPositiveNumberOrDash(driver.CurrentLapNumber) + "/~" + raceDetails.EstimatedWholeRaceLaps + " (" + raceDetails.EstimatedRaceLaps.toFixed(3) + ")"}>
                  </CWidgetSimple>
                </CCol>
                <CCol sm="4" lg="2">
                  <CWidgetSimple header="Laps Remaining" text={formatPositiveNumberOrDash(driver.DriverLapsRemaining)}>
                  </CWidgetSimple>
                </CCol> */}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default EventDetails