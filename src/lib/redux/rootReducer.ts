import {
  authSlice,
  pitwallSessionSlice,
  preferencesSlice,
  sessionSlice,
  standingsSlice,
  telemetrySlice,
} from "./slices";

export const reducer = {
  session: sessionSlice.reducer,
  pitwall: pitwallSessionSlice.reducer,
  standings: standingsSlice.reducer,
  telemetry: telemetrySlice.reducer,
  preferences: preferencesSlice.reducer,
  auth: authSlice.reducer,
};
