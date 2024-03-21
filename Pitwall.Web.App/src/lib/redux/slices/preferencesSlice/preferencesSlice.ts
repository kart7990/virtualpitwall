import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MeasurementSystem, PreferencesSliceState } from "./models";

const STORAGE_KEY: string = "pref_measurementSystem";

const initialState: PreferencesSliceState = {
  measurementSystem:
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem(STORAGE_KEY)
        ? MeasurementSystem[
            localStorage.getItem(STORAGE_KEY) as keyof typeof MeasurementSystem
          ]
        : MeasurementSystem.Metric
      : MeasurementSystem.Metric,
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    updateMeasurementSystem: (
      state,
      action: PayloadAction<MeasurementSystem>,
    ) => {
      localStorage.setItem(STORAGE_KEY, MeasurementSystem[action.payload]);
      state.measurementSystem = action.payload;
    },
    reset: (state) => {
      state = initialState;
    },
  },
});
