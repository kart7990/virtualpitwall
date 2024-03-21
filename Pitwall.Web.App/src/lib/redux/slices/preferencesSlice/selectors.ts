import type { ReduxState } from "@/lib/redux";
import { createSelector } from "@reduxjs/toolkit";
import { Measurement, MeasurementSystem } from "./models";

export const getMeasurementSystem = (state: ReduxState) =>
  state.preferences.measurementSystem;

export const selectMeasurementSystem = createSelector(
  [getMeasurementSystem],
  (measurementSystem: MeasurementSystem) => {
    return new Measurement(measurementSystem);
  },
);
