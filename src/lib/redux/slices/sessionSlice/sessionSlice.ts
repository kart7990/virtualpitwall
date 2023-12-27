import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DynamicSessionData, SessionState, TrackSession } from './models'

const initialState: SessionState = {
    pitBoxSession: undefined,
    completedLaps: [],
    telemetryLaps: [],
    isActive: false,
    isAvailable: false,
    timingProviders: [],
    webSocketEndpoints: undefined
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        init: (state, action: PayloadAction<SessionState>) => {
            state.pitBoxSession = action.payload.pitBoxSession
            state.completedLaps = action.payload.completedLaps
            state.telemetryLaps = action.payload.telemetryLaps
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
            console.log('TRACK SESSION CHANGE')
            let trackSessions = state.pitBoxSession!!.eventDetails.trackSessions.filter(ts => ts.sessionNumber < action.payload.sessionNumber)
            trackSessions?.push(action.payload)

            state.pitBoxSession!!.eventDetails.isActive = true
            state.pitBoxSession!!.eventDetails.isAvailable = true
            state.pitBoxSession!!.eventDetails.currentTrackSessionNumber = action.payload.sessionNumber
            state.pitBoxSession!!.eventDetails.trackSessions = trackSessions
        },
        reset: (state) => {
            //state = initialState
        }
    }
})

