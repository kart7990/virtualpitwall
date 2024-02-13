import { DASH } from "../constants";

export const convertMsToDisplay = (ms: number): string => {
  if (ms <= 0) {
    return DASH;
  }

  const milliseconds = (ms % 1000).toString().padStart(3, "0");
  const seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((ms / (60 * 1000)) % 60);

  return `${minutes}:${seconds}.${milliseconds}`;
};

export const convertToDelta = (delta: number): string => {
  const ms: number = Math.floor((delta - Math.floor(delta)) * 1000);
  const sec = Math.floor(delta % 60);
  const min: number = Math.floor(delta / 60);

  const secStr: string = sec.toString();
  const msStr: string = ms.toString().padStart(3, "0");

  let res: string = "";
  if (min > 0) {
    res += min.toString() + ":";
  }
  res += `${secStr}.${msStr}`;

  return res;
};

export const formatTime = (seconds: number) => {
  //Format to M:S:MS
  var pad = function (num: number, size: number) {
      return ("000" + num).slice(size * -1);
    },
    hours = Math.floor(seconds / 60 / 60),
    minutes = Math.floor(seconds / 60) % 60,
    seconds = Math.floor(seconds - minutes * 60);

  let formattedHours = hours > 0 ? pad(hours, 2) + ":" : "";
  return formattedHours + pad(minutes, 2) + ":" + pad(seconds, 2);
};
