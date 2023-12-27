/* Instruments */
import { sessionSlice, standingsSlice, telemetrySlice } from './slices'

export const reducer = {
  session: sessionSlice.reducer,
  standings: standingsSlice.reducer,
  telemetry: telemetrySlice.reducer
}
