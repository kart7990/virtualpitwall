/* Instruments */
import { sessionSlice, standingsSlice } from './slices'

export const reducer = {
  session: sessionSlice.reducer,
  standings: standingsSlice.reducer
}
