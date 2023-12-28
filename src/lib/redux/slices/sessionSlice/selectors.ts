import type { ReduxState } from '@/lib/redux'

export const selectTelemetryActive = (state: ReduxState) => state.session.pitBoxSession?.eventDetails.isCarTelemetryActive
export const selectCurrentTrackSessionNumber = (state: ReduxState) => state.session.pitBoxSession?.eventDetails.currentTrackSessionNumber