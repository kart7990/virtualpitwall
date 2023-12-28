import type { ReduxState } from '@/lib/redux'
import { createSelector } from '@reduxjs/toolkit'

const getCurrentTrackSessionNumber = (state: ReduxState) => state.session.pitBoxSession!!.eventDetails.currentTrackSessionNumber
const getTrackSessions = (state: ReduxState) => state.session.pitBoxSession!!.eventDetails.trackSessions


export const selectTelemetryActive = (state: ReduxState) => state.session.pitBoxSession?.eventDetails.isCarTelemetryActive
export const selectCurrentTrackSessionNumber = (state: ReduxState) => state.session.pitBoxSession?.eventDetails.currentTrackSessionNumber
export const selectCurrentSessionConditions = createSelector(
    [getCurrentTrackSessionNumber, getTrackSessions],
    (currentTrackSessionNumber, trackSessions) => {
        if (trackSessions?.length > 0) {
            return trackSessions.find(ts => ts.sessionNumber === currentTrackSessionNumber)?.conditions
        }
    }
)