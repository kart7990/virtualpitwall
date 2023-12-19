export const convertSpeed = (speedMetersPerSecond, useImperialUnits) => {
    let convertedValue = useImperialUnits ? (speedMetersPerSecond * 2.237).toFixed(1) : (speedMetersPerSecond * 3.6).toFixed(1)
    return parseFloat(convertedValue)
}

export const formatSpeed = (speedMetersPerSecond, useImperialUnits) => {
    return convertSpeed(speedMetersPerSecond, useImperialUnits) + " " + getSpeedUnit(useImperialUnits)
}

export const getSpeedUnit = (useImperialUnits) => {
    let unit = useImperialUnits ? "mph" : "km/h"
    return unit
}

export const convertVolume = (liters, useImperialUnits) => {
    let convertedValue = useImperialUnits ? (liters / 3.785).toFixed(3) : liters.toFixed(3)
    return parseFloat(convertedValue)
}

export const formatVolume = (liters, useImperialUnits) => {
    return convertVolume(liters, useImperialUnits) + " " + getVolumeUnit(useImperialUnits)
}

export const getVolumeUnit = (useImperialUnits) => {
    let unit = useImperialUnits ? "gal" : "L"
    return unit
}

export const convertTemp = (celcius, useImperialUnits) => {
    let convertedValue = useImperialUnits ? ((celcius * 9 / 5) + 32).toFixed(2) : celcius.toFixed(2)
    return parseFloat(convertedValue)
}

export const convertMsToDisplay = (ms) => {
    var milliseconds = padMs(ms % 1000);
    var seconds = pad(Math.floor((ms / 1000) % 60));
    var minutes = Math.floor((ms / (60 * 1000)) % 60);

    return minutes + ":" + seconds + "." + milliseconds;
}
const padMs = (value) => {
    if (value < 10) {
        return '00' + value;
    } else if (value < 100) {
        return '0' + value;
    }
    else {
        return value;
    }
}

const pad = (value) => {
    if (value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

export const formatTemp = (celcius, useImperialUnits) => {
    return celcius ? convertTemp(celcius, useImperialUnits) + " " + getTempUnit(useImperialUnits) : "-"
}

export const getTempUnit = (useImperialUnits) => {
    let unit = useImperialUnits ? "F" : "C"
    return unit
}