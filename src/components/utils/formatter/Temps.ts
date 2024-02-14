import { Measurement } from "@/lib/redux/slices/preferencesSlice/models";
import { DASH } from "../constants";

export const convertTemp = (celsius: number, measurement: Measurement) => {
  celsius = Number(celsius);
  let convertedValue = measurement.isImperial()
    ? ((celsius * 9) / 5 + 32).toFixed(2)
    : celsius.toFixed(2);
  return parseFloat(convertedValue);
};

export const formatTemp = (celsius: number, measurement: Measurement) => {
  return celsius
    ? convertTemp(celsius, measurement) + " " + getTempUnit(measurement)
    : DASH;
};

export const getTempUnit = (measurement: Measurement) => {
  return measurement.isImperial() ? "°F" : "°C";
};

export const convertWeatherType = (type: number) => {
  switch (type) {
    case 0:
      return "constant";
    case 1:
      return "dynamic";
    default:
      return "n/a";
  }
};
