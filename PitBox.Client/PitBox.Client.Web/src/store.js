import { createStore } from 'redux'
import { combineReducers } from 'redux';

import authReducer from './auth/authReducer';
import pitboxSessionReducer from './containers/pitbox/session/SessionReducer';

const initialPreferencesState = {
  sidebarShow: 'responsive',
  darkMode: true
}

const initialPitboxPreferencesState = {
  useImperialUnits: false
}

const initialTimingPreferencesState = {
  numberOfPitstops: 0,
  pitstopTime: 0,
  timeRemainingAtEndLastLap: 0,
  leaderLapNumber: 0,
  fixedLaps: -1,
  selectedDriverCarNumber: "-1",
  lapAggregate: 'average',
  lapFilter: 'all',
  numberOfLaps: 1
}

const initialState = {
  sidebarShow: false,
  darkMode: true,
  authenticationasd: {
    isAuthenticated: false,
    roles: [],
    isUserLogout: false,
    token: null
  },
  sessionId: null,
  useImperialUnits: false,
  isSessionDataLive: false,
  isCarTelemetryLive: false,
  standingsSelectedCarNumber: -1,
  pitBoxSession: {
    // id: '1f977228-a4b8-402a-88a5-86e45823ed91',
    // pitBoxTimingProviders: [],
    // pitBoxTelemetryProviders: [],
    // isSessionDataLive: false
  },
  event: {
    // type: 'Race',
    // currentSessionNumber: -1
  },
  //session: {
  // sessionNumber: 1,
  // sessionName: "RACE",
  // sessionType: "Race",
  // playerCustId: 29351,
  // raceLaps: "unlimited",
  // raceTime: 3600.0,
  // isTimed: true,
  // isFixedLaps: false,
  // isMulticlass: true,
  // isTeamEvent: false,
  // isActive: false,
  // track: {
  //   id: 168,
  //   name: "Suzuka International Racing Course",
  //   codeName: "suzuka grandprix",
  //   length: 5.75
  // }
  //},
  //dynamicSessionData: {
  // sessionState: "Racing",
  // flags: "",
  //},
  //conditions: {
  // isSessionFinished: false,
  // timeOfDay: 3332,
  // airDensity: 1.2362656593322754,
  // airPressure: 29.824480056762695,
  // airTemp: 21.509387969970703,
  // fogLevel: 0.0,
  // skies: "Partly cloudy",
  // weatherType: 1,
  // trackTemp: 22.22222900390625,
  // trackUsage: "moderately high usage",
  // relativeHumidity: 0.53403353691101074,
  // windDirection: "NW (336°)",
  // windSpeed: 1.3111910820007324
  //},
  // player: {
  //   isCurrentDriver: true,
  //   car: {
  //     teamId: 0,
  //     teamName: "David C. Holland",
  //     isPacecar: false,
  //     carNumber: "36",
  //     carNumberRaw: 36,
  //     carId: 128,
  //     carName: "Dallara P217 LMP2",
  //     carClassId: 2523,
  //     carClassRelSpeed: 150,
  //     carClassShortName: "Dallara P217",
  //     carShortName: "Dallara P217 LMP2"
  //   },
  //   id: 35,
  //   custId: 29351,
  //   name: "David C. Holland",
  //   shortName: "Holland, D",
  //   iRating: 6348,
  //   isSpectator: false
  // },
  playerLapTelemetry: [
  ],
  //timing: {
  // raceTimeRemaining: 5.983626335468216,
  // estimatedRaceLaps: 79.775741526597457,
  // estimatedWholeRaceLaps: 80,
  // leaderLapsRemaining: 0.15161408856609937,
  // leaderWholeLapsRemaining: 0,
  // simTimeOfDay: 53694.0,
  // simDate: null
  //},
  //telemetry: {
  // timingTelemetry: {
  //   currentLapTime: 0,
  //   lapDeltaToSessionBestLap: 0,
  //   driverLapsComplete: 0,
  //   lapDistancePercentage: 0
  // },
  // carTelemetry: {
  //   throttle: 0,
  //   brake: 0,
  //   clutch: 0,
  //   steeringAngle: 0,
  //   rpm: 0,
  //   speed: 0,
  //   fuelQuantity: 0,
  //   fuelPercent: 0,
  //   fuelConsumedLap: 0,
  //   fuelConsumedTotal: 0,
  //   fuelPressure: 0,
  //   oilTemp: 0,
  //   oilPressure: 0,
  //   waterTemp: 0,
  //   voltage: 0
  // }
  //},
  standings: [
  ],
  lapHistory: [
  ],
  lapsRemainingVariables: {
    numberOfPitstops: 0,
    pitstopTime: 0,
    timeRemainingAtEndLastLap: 0,
    leaderLapNumber: 0,
    fixedLaps: -1,
    selectedDriverCarNumber: "-1",
    lapAggregate: 'average',
    lapFilter: 'all',
    numberOfLaps: 1
  }
}

const sitePreferencesReducer = (state = initialPreferencesState, { type, ...payload }) => {
  switch (type) {
    case 'set-pref':
      return { ...state, ...payload }
    default:
      return state
  }
}

const pitboxPreferencesReducer = (state = initialPitboxPreferencesState, { type, ...payload }) => {
  switch (type) {
    case 'set-pitbox-pref':
      return { ...state, ...payload }
    default:
      return state
  }
}

const timingPreferencesReducer = (state = initialTimingPreferencesState, { type, ...payload }) => {
  switch (type) {
    case 'set-timing-pref':
      return { ...state, ...payload }
    default:
      return state
  }
}


const changeState = (state = initialState, { type, ...payload }) => {
  switch (type) {
    case 'reset':
      return initialState
    case 'set':
      return { ...state, ...payload }
    case 'updateSession':
      return { ...state, session: { ...state.session, isFinished: payload.session.isFinished, raceTimeRemaining: payload.session.raceTimeRemaining, sessionState: payload.session.sessionState } }
    case 'newLapTelemetry':
      let newLapTelemetryArray = state.playerLapTelemetry.slice()
      newLapTelemetryArray.push(payload.lapTelemetry)
      return { ...state, playerLapTelemetry: newLapTelemetryArray }
    case 'addLapResult':
      let newLapResultArray = state.lapHistory.slice()
      payload.lap.raceTimeRemaining = state.timing.raceTimeRemaining
      newLapResultArray.push(payload.lap)
      return { ...state, lapHistory: newLapResultArray }
    case 'addLapsRemainingCalculation':
      let newArray = state.lapsRemainingCalculationHistory.slice()
      newArray.push(payload.lapsRemainingCalculation)
      return { ...state, lapsRemainingCalculationHistory: newArray }
    case 'calculateLapsRemaining':
    // //TODO: make the position configurable, could even use car number
    // let leaderLapsSorted = state.lapHistory.filter(l => l.position === 1).sort((a, b) => parseFloat(a.lapTime) - parseFloat(b.lapTime))
    // console.log('leader laps sorted', leaderLapsSorted)
    // let leaderFastestLaps = leaderLapsSorted.slice(-payload.lapsToAverage)
    // console.log('leader fastest 3 laps', leaderFastestLaps)
    // let laptimeTotal = 0
    // leaderFastestLaps.forEach(lap => {
    //   laptimeTotal += lap.lapTime
    // });
    // console.log('laptimetotal', laptimeTotal)
    // let averageLapTime = (laptimeTotal / leaderFastestLaps.length) / 1000
    // console.log('averageLapTime', averageLapTime)
    // let lapsRemaining = timing.raceTimeRemaining / averageLapTime
    // let totalRaceLaps = session.raceTime / averageLapTime
    // console.log('lapsRemaining', lapsRemaining)
    // let wholeLapsRemaining = Math.ceil(lapsRemaining)
    // console.log('wholeLapsRemaining', wholeLapsRemaining)
    case 'addSession':
    //UNUSED, will need if sessions array (session history) introduced
    // console.log('IN REDUCER ADD SESSION PAYLOAD: ', payload)
    // let newArray = state.Sessions.slice()
    // let existingSessionIndex = newArray.findIndex(session => session.SessionNumber === payload.Session.SessionNumber)

    // if (existingSessionIndex !== -1) {
    //   //Remove existing session with same session number
    //   newArray.splice(existingSessionIndex, 1)
    // }
    // newArray.push(payload.Session)
    // console.log(newArray)
    // return { ...state, Sessions: newArray, Session: payload.Session }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  preferences: sitePreferencesReducer,
  authentication: authReducer,
  pitboxPreferences: pitboxPreferencesReducer,
  timingPreferences: timingPreferencesReducer,
  pitboxSession: pitboxSessionReducer
});
//const store = createStore(rootReducer)
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//const store = createStore(changeState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store