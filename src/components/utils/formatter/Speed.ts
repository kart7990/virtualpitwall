import { Measurement } from "@/lib/redux/slices/preferencesSlice/models";

export const convertSpeed = (
  metersPerSecond: number,
  measurement: Measurement,
) => {
  let res =
    measurement && measurement.isImperial()
      ? (metersPerSecond * 2.237).toFixed(1)
      : (metersPerSecond * 3.6).toFixed(1);
  return parseFloat(res);
};

export const formatSpeed = (
  metersPerSeconds: number,
  measurement: Measurement,
) => {
  return (
    convertSpeed(metersPerSeconds, measurement) +
    " " +
    getSpeedUnit(measurement)
  );
};

export const getSpeedUnit = (measurement: Measurement) => {
  return measurement && measurement.isImperial() ? "mph" : "km/h";
};
