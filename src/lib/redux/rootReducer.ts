/* Instruments */
import { counterSlice, standingsSlice } from './slices'

export const reducer = {
  counter: counterSlice.reducer,
  standings: standingsSlice.reducer,
}
