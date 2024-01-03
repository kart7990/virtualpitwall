import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DynamicSessionData, SessionState, TrackSession, Lap, LapTelemetry } from './models'

const initialState: SessionState = {
    pitBoxSession: undefined,
    completedLaps: [],
    telemetryLaps: [],
    isActive: false,
    isAvailable: false,
    timingProviders: [],
    webSocketEndpoints: undefined
}

export interface AddLapsPayload {
    sessionNumber: number;
    laps: Lap[];
}

export interface AddTelemetryLapsPayload {
    sessionNumber: number;
    laps: LapTelemetry[];
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        init: (state, action: PayloadAction<SessionState>) => {
            action.payload.pitBoxSession?.eventDetails.trackSessions.forEach(trackSession => {
                trackSession.completedLaps = action.payload.completedLaps.filter(lap => lap.sessionNumber === trackSession.sessionNumber);
                trackSession.completedTelemetryLaps = action.payload.telemetryLaps.filter(lap => lap.sessionNumber === trackSession.sessionNumber);
            });
            state.pitBoxSession = action.payload.pitBoxSession
            state.isActive = action.payload.isActive
            state.isAvailable = action.payload.isAvailable
            state.timingProviders = action.payload.timingProviders
            state.webSocketEndpoints = action.payload.webSocketEndpoints
        },
        trackSessionUpdate: (state, action: PayloadAction<DynamicSessionData>) => {
            state.pitBoxSession!!.eventDetails.isCarTelemetryActive = action.payload.isCarTelemetryActive
            state.pitBoxSession!!.eventDetails.isActive = action.payload.isActive
            state.pitBoxSession!!.eventDetails.isAvailable = action.payload.isAvailable
            state.pitBoxSession!!.eventDetails.trackSessions = state.pitBoxSession!!.eventDetails.trackSessions.map(trackSession =>
                trackSession.sessionNumber === state.pitBoxSession!!.eventDetails.currentTrackSessionNumber ? { ...trackSession, ...action.payload } : trackSession
            )
        },
        trackSessionChange: (state, action: PayloadAction<TrackSession>) => {
            let trackSessions = state.pitBoxSession!!.eventDetails.trackSessions.filter(ts => ts.sessionNumber < action.payload.sessionNumber)
            trackSessions?.push(action.payload)

            state.pitBoxSession!!.eventDetails.isActive = true
            state.pitBoxSession!!.eventDetails.isAvailable = true
            state.pitBoxSession!!.eventDetails.currentTrackSessionNumber = action.payload.sessionNumber
            state.pitBoxSession!!.eventDetails.trackSessions = trackSessions
        },
        addLaps: (state, action: PayloadAction<AddLapsPayload>) => {
            state.pitBoxSession!!.eventDetails.trackSessions.find(trackSession =>
                trackSession.sessionNumber === action.payload.sessionNumber)!!.completedLaps = state.pitBoxSession!!.eventDetails.trackSessions.find(trackSession =>
                    trackSession.sessionNumber === action.payload.sessionNumber)!!.completedLaps.concat(action.payload.laps)
        },
        addTelemetryLap: (state, action: PayloadAction<AddTelemetryLapsPayload>) => {
            state.pitBoxSession!!.eventDetails.trackSessions.find(trackSession =>
                trackSession.sessionNumber === action.payload.sessionNumber)!!.completedTelemetryLaps = state.pitBoxSession!!.eventDetails.trackSessions.find(trackSession =>
                    trackSession.sessionNumber === action.payload.sessionNumber)!!.completedTelemetryLaps.concat(action.payload.laps)
        },
        reset: (state) => {
            //this might not work, had issues in other slices, need to test
            state = initialState
        }
    }
})

