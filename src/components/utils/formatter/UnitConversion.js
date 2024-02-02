export const convertSpeed = (speedMetersPerSecond, useImperialUnits) => {
  let convertedValue = useImperialUnits
    ? (speedMetersPerSecond * 2.237).toFixed(1)
    : (speedMetersPerSecond * 3.6).toFixed(1);
  return parseFloat(convertedValue);
};

export const formatSpeed = (speedMetersPerSecond, useImperialUnits) => {
  return (
    convertSpeed(speedMetersPerSecond, useImperialUnits) +
    " " +
    getSpeedUnit(useImperialUnits)
  );
};

export const getSpeedUnit = (useImperialUnits) => {
  let unit = useImperialUnits ? "mph" : "km/h";
  return unit;
};

export const convertVolume = (liters, useImperialUnits) => {
  let convertedValue = useImperialUnits
    ? (liters / 3.785).toFixed(3)
    : liters.toFixed(3);
  return parseFloat(convertedValue);
};

export const formatVolume = (liters, useImperialUnits) => {
  return (
    convertVolume(liters, useImperialUnits) +
    " " +
    getVolumeUnit(useImperialUnits)
  );
};

export const getVolumeUnit = (useImperialUnits) => {
  let unit = useImperialUnits ? "gal" : "L";
  return unit;
};

export const convertTemp = (celsius, useImperialUnits) => {
  celsius = Number(celsius);
  let convertedValue = useImperialUnits
    ? ((celsius * 9) / 5 + 32).toFixed(2)
    : celsius.toFixed(2);
  return parseFloat(convertedValue);
};

/**
 * @deprecated Use TimeConversion.convertMsToDisplay
 */
export const convertMsToDisplay = (ms) => {
  if (ms > 0) {
    var milliseconds = padMs(ms % 1000);
    var seconds = pad(Math.floor((ms / 1000) % 60));
    var minutes = Math.floor((ms / (60 * 1000)) % 60);

    return minutes + ":" + seconds + "." + milliseconds;
  } else {
    return "-";
  }
};

/**
 * @deprecated
 */
const padMs = (value) => {
  if (value < 10) {
    return "00" + value;
  } else if (value < 100) {
    return "0" + value;
  } else {
    return value;
  }
};

/**
 * @deprecated
 */
const pad = (value) => {
  if (value < 10) {
    return "0" + value;
  } else {
    return value;
  }
};

export const formatTemp = (celsius, useImperialUnits) => {
  return celsius
    ? convertTemp(celsius, useImperialUnits) +
        " " +
        getTempUnit(useImperialUnits)
    : "-";
};

export const getTempUnit = (useImperialUnits) => {
  let unit = useImperialUnits ? "°F" : "°C";
  return unit;
};

export const convertWeatherType = (type) => {
  switch (type) {
    case 0:
      return "constant";
    case 1:
      return "dynamic";
    default:
      return "n/a";
  }
};

export const formatTime = (timeInSeconds) => {
  //Format to M:S:MS
  var pad = function (num, size) {
      return ("000" + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60);

  let formattedHours = hours > 0 ? pad(hours, 2) + ":" : "";
  return formattedHours + pad(minutes, 2) + ":" + pad(seconds, 2);
};
