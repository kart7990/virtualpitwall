import { SESSION_JOIN, SESSION_RESET, TRACK_SESSION_CHANGE, TRACK_SESSION_UPDATE } from "./SessionActions";
import { SET_STANDINGS, SET_SELECTED_CAR } from "../standings/StandingsActions";
import standingsReducer from '../standings/StandingsReducer';
import { ADD_LAPS } from "../laps/LapActions";
import { ADD_TELEMETRY_LAPS, SET_TELEMETRY } from "../telemetry/TelemetryActions";
import telemetryReducer from "../telemetry/TelemetryReducer";

export default function (state = { isActive: false, isAvailable: false }, action) {
    if (action.type !== TRACK_SESSION_UPDATE && action.type !== SET_STANDINGS && action.type !== SET_TELEMETRY && action.type !== ADD_LAPS) {
        //console.log('sessionReducer', state, action)
    }
    switch (action.type) {
        case SESSION_JOIN:
            action.pitBoxSession.eventDetails.trackSessions.forEach(trackSession => {
                trackSession.completedLaps = action.completedLaps.filter(lap => lap.sessionNumber === trackSession.sessionNumber);
                trackSession.telemetryLaps = action.completedTelemetryLaps.filter(lap => lap.sessionNumber === trackSession.sessionNumber);
            });

            return {
                ...action.pitBoxSession,
                eventDetails: {
                    ...action.pitBoxSession.eventDetails,
                    isActive: action.isActive,
                    isAvailable: action.isAvailable
                },
                webSocketEndpoints: action.webSocketEndpoints
            }
        case SESSION_RESET:
            return {
                ...state,
                ...action.pitBoxSession,
                eventDetails: {
                    ...action.pitBoxSession.eventDetails,
                    isActive: true,
                    isAvailable: true
                }
            }
        case TRACK_SESSION_CHANGE:
            //TODO: DUPLICATE THIS LOGIC ON SERVER TO CLEAN UP OLD SESSIONS?
            let newTrackSessionsArray = state.eventDetails.trackSessions.filter(ts => ts.sessionNumber < action.newTrackSession.sessionNumber)
            action.newTrackSession.completedLaps = []
            action.newTrackSession.telemetryLaps = []
            newTrackSessionsArray.push(action.newTrackSession)
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    isActive: true,
                    isAvailable: true,
                    currentTrackSessionNumber: action.newTrackSession.sessionNumber,
                    trackSessions: newTrackSessionsArray
                }
            }
        case TRACK_SESSION_UPDATE:
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    isCarTelemetryActive: action.dynamicSessionData.isCarTelemetryActive,
                    isActive: action.dynamicSessionData.isActive,
                    isAvailable: action.dynamicSessionData.isAvailable,
                    trackSessions: state.eventDetails.trackSessions.map(trackSession => trackSession.sessionNumber === state.eventDetails.currentTrackSessionNumber ? { ...trackSession, ...action.dynamicSessionData } : trackSession)
                }
            };
        case SET_STANDINGS:
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    standings: standingsReducer(state.standings, action)
                }
            }
        case SET_TELEMETRY:
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    telemetry: telemetryReducer(state.telemetry, action)
                }
            }
        case ADD_LAPS:
            var state = {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    trackSessions: state.eventDetails.trackSessions.map(trackSession => trackSession.sessionNumber === action.sessionNumber ? { ...trackSession, completedLaps: trackSession.completedLaps.concat(action.newLaps) } : trackSession)
                }
            }
            return state
        case ADD_TELEMETRY_LAPS:
            return {
                ...state,
                eventDetails: {
                    ...state.eventDetails,
                    trackSessions: state.eventDetails.trackSessions.map(trackSession => trackSession.sessionNumber === action.sessionNumber ? { ...trackSession, telemetryLaps: trackSession.telemetryLaps.concat(action.newLaps) } : trackSession)
                }
            }
        case SET_SELECTED_CAR:
            return {
                ...state,
                standingsSelectedCarNumber: action.carNumber
            }
        default:
            return state;
    }
}