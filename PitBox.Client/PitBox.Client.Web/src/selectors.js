import { createSelector } from 'reselect'

const getLapRemainingVariables = state => state.timingPreferences
const getLapHistory = state => state.lapHistory

const getStandings = state => state.pitboxSession.eventDetails.standings
const getLeader = state => state.pitboxSession.eventDetails?.standings?.find(s => s.position === 1)

const getCurrentTrackSessionNumber = state => state.pitboxSession.eventDetails?.currentTrackSessionNumber
const getTrackSessions = state => state.pitboxSession.eventDetails?.trackSessions

export const currentDriversSelector = createSelector(
  [getStandings],
  (standings) => {
    if (standings) {
      return standings.sort((a, b) => parseInt(a.carNumber) - parseInt(b.carNumber)).map(s => {
        return { carNumber: s.carNumber, driverShortName: s.driverShortName }
      })
    }
  }
)

export const eventSessionNumbersTypesAndLaps = createSelector(
  [getTrackSessions],
  (trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.map(ts => { return { sessionNumber: ts.sessionNumber, sessionType: ts.sessionType, laps: ts.completedLaps } })
    }
  }
)

export const currentSessionSelector = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)
    }
  }
)

export const currentSessionIsSpectatorSelector = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.isSpectator
    }
  }
)

export const currentSessionLaps = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    //console.log('TRACK SESSION CALC')
    return trackSessions?.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.completedLaps
  }
)

export const currentSessionTelemetryLaps = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.telemetryLaps
    }
  }
)

export const currentSessionTimingSelector = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.timing
    }
  }
)

export const currentSessionCondidtionsSelector = createSelector(
  [getCurrentTrackSessionNumber, getTrackSessions],
  (currentTrackSessionNumber, trackSessions) => {
    if (trackSessions?.length > 0) {
      return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.conditions
    }
  }
)


export const lapsRemainingSelector = createSelector(
  [getLapRemainingVariables, currentSessionLaps, getLeader],
  (lapRemainingSettings, lapHistory, leader) => {
    var lapsRemainingCalculation = {
      lapsRemaining: -1,
      wholeLapsRemaining: -1,
      raceLaps: -1,
      wholeRaceLaps: -1
    }
    //console.log(lapHistory, leader)

    if (lapRemainingSettings.fixedLaps > 0 && leader !== undefined) {
      //fixed laps
      let lapsRemaining = lapRemainingSettings.fixedLaps - leader.lap
      let raceLaps = lapRemainingSettings.fixedLaps

      lapsRemainingCalculation = {
        lapsRemaining: lapsRemaining,
        wholeLapsRemaining: lapsRemaining,
        raceLaps: raceLaps,
        wholeRaceLaps: raceLaps
      }
    } else if (lapHistory && lapHistory.length > 0 && leader !== undefined) {
      //timed race
      let selectedDriverLapHistory = null

      if (lapRemainingSettings.selectedDriverCarNumber === "-1") {
        selectedDriverLapHistory = lapHistory.filter(l => l.carNumber === leader.carNumber && !l.inPitLane)
      } else {
        selectedDriverLapHistory = lapHistory.filter(l => l.carNumber === lapRemainingSettings.selectedDriverCarNumber && !l.inPitLane)
      }

      if (selectedDriverLapHistory.length > 0) {

        const [lastLap] = selectedDriverLapHistory.slice(-1)

        let timeRemaining = lastLap.raceTimeRemaining

        //'all' lap filter default
        let filteredLaps = selectedDriverLapHistory

        if (lapRemainingSettings.lapFilter !== 'all') {
          if (lapRemainingSettings.lapFilter === 'last') {
            let sortedLaps = selectedDriverLapHistory.sort((a, b) => parseFloat(a.lapNumber) - parseFloat(b.lapNumber))
            filteredLaps = sortedLaps.slice(-lapRemainingSettings.numberOfLaps)
          } else if (lapRemainingSettings.lapFilter === 'first') {
            let sortedLaps = selectedDriverLapHistory.sort((a, b) => parseFloat(b.lapNumber) - parseFloat(a.lapNumber))
            filteredLaps = sortedLaps.slice(-lapRemainingSettings.numberOfLaps)
          } else if (lapRemainingSettings.lapFilter === 'fastest') {
            let sortedLaps = selectedDriverLapHistory.sort((a, b) => parseFloat(b.lapTime) - parseFloat(a.lapTime))
            filteredLaps = sortedLaps.slice(-lapRemainingSettings.numberOfLaps)
          } else if (lapRemainingSettings.lapFilter === 'slowest') {
            let sortedLaps = selectedDriverLapHistory.sort((a, b) => parseFloat(a.lapTime) - parseFloat(b.lapTime))
            filteredLaps = sortedLaps.slice(-lapRemainingSettings.numberOfLaps)
          }
        }

        // else {
        //   let sortedLaps = selectedDriverLapHistory.sort((a, b) => parseFloat(b.lapTime) - parseFloat(a.lapTime))
        //   filteredLaps = sortedLaps.slice(-lapRemainingSettings.numberOfLaps)
        // }

        let aggLapTime = null

        //console.log(filteredLaps)

        if (lapRemainingSettings.lapAggregate === 'fastest') {
          aggLapTime = Math.min.apply(Math, filteredLaps.map(lap => lap.lapTime)) / 1000
        } else if (lapRemainingSettings.lapAggregate === 'slowest') {
          aggLapTime = Math.max.apply(Math, filteredLaps.map(lap => lap.lapTime)) / 1000
        } else {
          //assume average
          let laptimeTotal = 0
          filteredLaps.forEach(lap => {
            laptimeTotal += lap.lapTime
          });

          let averageLapTime = (laptimeTotal / filteredLaps.length) / 1000
          aggLapTime = averageLapTime
        }

        let stopsRemaining = lapRemainingSettings.numberOfPitstops - lastLap.pitStopCount

        if (stopsRemaining > 0) {
          timeRemaining = timeRemaining - (stopsRemaining * lapRemainingSettings.pitstopTime)
        }

        let lapsRemaining = timeRemaining / aggLapTime
        let wholeLapsRemaining = Math.floor(lapsRemaining)
        let raceLaps = lastLap.lapNumber + lapsRemaining

        lapsRemainingCalculation = {
          lapsRemaining: lapsRemaining,
          wholeLapsRemaining: wholeLapsRemaining,
          raceLaps: raceLaps.toFixed(3),
          wholeRaceLaps: Math.ceil(raceLaps),
          lapTimeUsedForCalculation: aggLapTime
        }
      }
    }
    return lapsRemainingCalculation
  }
)
