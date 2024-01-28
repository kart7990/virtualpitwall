import { authSlice, pitwallSlice, preferencesSlice } from "./slices";

export const reducer = {
  pitwall: pitwallSlice.reducer,
  preferences: preferencesSlice.reducer,
  auth: authSlice.reducer,
};
