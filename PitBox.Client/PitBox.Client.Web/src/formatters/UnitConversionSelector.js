import { createSelector } from 'reselect'

const getUnitSelection = state => state.useImperialUnits
const getTelemetry = state => state.telemetry

export const getConvertedTelemetry = createSelector(
  [getUnitSelection, getTelemetry],
  (useImperialUnits, telemetry) => {
    return {Speed: formatSpeed(telemetry.speed, useImperialUnits)}
  }
)

export const convertSpeed = (speedMetersPerSecond, useImperialUnits) => {
    let convertedValue = useImperialUnits ? (speedMetersPerSecond * 2.237).toFixed(2) : (speedMetersPerSecond * 3.6).toFixed(2)
    return convertedValue
}

export const formatSpeed = (speedMetersPerSecond, useImperialUnits) => {
    let speed = convertSpeed(speedMetersPerSecond, useImperialUnits)
    let unit =  useImperialUnits ? " mph" :  " km/h"
    return speed + unit
}