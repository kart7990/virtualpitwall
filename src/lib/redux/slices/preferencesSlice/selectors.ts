import type { ReduxState } from "@/lib/redux";
import { Measurement } from "./models";

export const selectMeasurementSystem = (state: ReduxState) =>
  new Measurement(state.preferences.measurementSystem);
