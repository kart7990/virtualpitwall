import type { ReduxState } from "@/lib/redux";

export const selectLiveTiming = (state: ReduxState) =>
  state.standings.liveTiming;
export const selectedCarNumber = (state: ReduxState) =>
  state.standings.selectedCarNumber;
