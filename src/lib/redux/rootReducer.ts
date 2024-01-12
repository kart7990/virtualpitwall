import {
  authSlice,
  preferencesSlice,
  sessionSlice,
  standingsSlice,
  telemetrySlice,
} from "./slices";

export const reducer = {
  session: sessionSlice.reducer,
  standings: standingsSlice.reducer,
  telemetry: telemetrySlice.reducer,
  preferences: preferencesSlice.reducer,
  auth: authSlice.reducer,
};
