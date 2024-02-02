import { NO_TIME } from "../constants";

export const convertMsToDisplay = (ms: number): string => {
  if (ms <= 0) {
    return NO_TIME;
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
