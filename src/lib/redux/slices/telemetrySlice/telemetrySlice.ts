import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Telemetry } from "./models";

const initialState: TelemetrySliceState = {
  telemetry: {
    carTelemetry: undefined,
    timingTelemetry: undefined,
  },
};

export const telemetrySlice = createSlice({
  name: "telemetry",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Telemetry>) => {
      state.telemetry.carTelemetry = action.payload.carTelemetry;
      state.telemetry.timingTelemetry = action.payload.timingTelemetry;
    },
    reset: (state) => {
      state = initialState;
    },
  },
});

export interface TelemetrySliceState {
  telemetry: Telemetry;
}
