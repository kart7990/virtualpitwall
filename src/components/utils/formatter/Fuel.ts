import { Measurement } from "@/lib/redux/slices/preferencesSlice/models";
import { N_A } from "../constants";

export const formatFuel = (num: number, measurement: Measurement) => {
  return num === -1 || isNaN(num) || num == Infinity || num == -Infinity
    ? N_A
    : formatVolume(num, measurement);
};

export const convertVolume = (liters: number, measurement: Measurement) => {
  let convertedValue = measurement.isImperial()
    ? (liters / 3.785).toFixed(3)
    : liters.toFixed(3);
  return parseFloat(convertedValue);
};

export const formatVolume = (liters: number, measurement: Measurement) => {
  return convertVolume(liters, measurement) + " " + getVolumeUnit(measurement);
};

export const getVolumeUnit = (measurement: Measurement) => {
  return measurement.isImperial() ? "gal" : "L";
};
